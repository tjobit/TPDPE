import { Schema, model } from "mongoose";

const usersSchema = new Schema({
  name: String,
  email: String,
  salt: String,
  password: String,
});

const User = model("tjo-users", usersSchema);

export default User;