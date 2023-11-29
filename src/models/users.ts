import { Schema, model } from "mongoose";

const usersSchema = new Schema({
  name: String,
  email: String,
  salt: String,
  password: String,
  savedSearches: [{ type: Schema.Types.ObjectId, ref: 'SavedSearches' }],
});

// Virtual field to get the string representation of the ObjectId
usersSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

usersSchema.set("toJSON", {
  virtuals: true,
});

const User = model("tjo-users", usersSchema);

export default User;
