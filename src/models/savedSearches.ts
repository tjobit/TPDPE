import { Schema, model } from "mongoose";

const savedSearchesSchema = new Schema({
  parameters: {
    Etiquette_DPE: String,
    Etiquette_GES: String,
    "Code_postal_(BAN)": Number,
    Surface_habitable_logement: Number,
  },
  results: [],
});

// Virtual field to get the string representation of the ObjectId
savedSearchesSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

savedSearchesSchema.set("toJSON", {
  virtuals: true,
});

const SavedSearches = model("tjo-savedSearches", savedSearchesSchema);

export default SavedSearches;
