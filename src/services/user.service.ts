import User from "../models/users";
import { HttpException } from "../exceptions/HttpException";

export async function getUserProfile(id: string) {
  const user = await User.findById(id);

  if (!user) throw new HttpException(404, `User not found`);

  const { _id, name, email } = user;

  return { id: _id, name: name, email: email };
}
