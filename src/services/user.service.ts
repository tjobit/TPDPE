import User from "../models/users";
import { HttpException } from "../exceptions/HttpException";

export async function getUserProfile(id: string) {
  const user = await User.findById(id);

  if (!user) throw new HttpException(404, `User not found`);

  const { name, email } = user;

  return { name: name, email: email };
}
