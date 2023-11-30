import User from "../models/users";
import { HttpException } from "../exceptions/HttpException";
import { UserAccount } from "../interfaces/auth.interface";
import SavedSearches from "../models/savedSearches";

export async function getUserProfile(id: string) {
  const user = await User.findById(id);

  if (!user) throw new HttpException(404, `User not found`);

  const { _id, name, email } = user;

  return { id: _id, name: name, email: email };
}

export async function deleteUser(userId: string) {
  const user = await User.findById(userId);

  if (!user) throw new HttpException(404, `User not found`);

  const savedSearches = user.savedSearches;

  for (const search of savedSearches) {
    await SavedSearches.findByIdAndDelete(search);
  }

  await user.remove();

  return { message: "User deleted" };
}
