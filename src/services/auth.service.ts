import User from "../models/users";
import { UserAccount } from "../interfaces/auth.interface";
import jwt from "jsonwebtoken";
import { authenticatePassword, createUserToken, encryptPassword } from "../utils/auth.utils";
import { HttpException } from "../exceptions/HttpException";
import { getUserProfile } from "./user.service";

export async function register(name: string, email: string, password: string) {
  const findUser = await User.findOne({ email: email });

  if (findUser) {
    throw new HttpException(409, `This email is already registered`);
  }

  const { salt, hashedPassword } = encryptPassword(password);

  const newUser = new User({
    name: name,
    email: email,
    salt: salt,
    password: hashedPassword,
  });

  await newUser.save();

  const userProfile = await getUserProfile(newUser._id);

  return { ...createUserToken(userProfile), userProfile };
}

export async function login(email: string, password: string) {
  const findUser = await User.findOne({ email: email });

  if (!findUser) {
    throw new HttpException(409, `This email is not registered`);
  }

  const { salt, password: hashedPassword } = findUser;

  const authenticated = authenticatePassword(password, salt, hashedPassword);

  if (!authenticated) {
    throw new HttpException(401, `Incorrect password`);
  }

  const userProfile = await getUserProfile(findUser._id);

  return { ...createUserToken(userProfile), userProfile };
}

export function refreshAuthToken(refreshToken: string) {
  const secretKey = process.env.REFRESH_KEY_SECRET;
  const user = jwt.verify(refreshToken, secretKey) as UserAccount;

  return createUserToken(user);
}
