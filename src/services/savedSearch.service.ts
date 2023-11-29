import { UserAccount } from "../interfaces/auth.interface";
import SavedSearches from "../models/savedSearches";
import User from "../models/users";

export async function saveSearch(dpe: string, ges: string, zipcode: number, surface: number, results: any, connectedUser: UserAccount) {
  const parameters = {
    Etiquette_DPE: dpe,
    Etiquette_GES: ges,
    "Code_postal_(BAN)": zipcode,
    Surface_habitable_logement: surface,
  };

  const savedSearch = new SavedSearches({
    parameters: parameters,
    results: results,
  });

  await savedSearch.save();

  const user = await User.findById(connectedUser.id);

  user.savedSearches.push(savedSearch);

  await user.save();
}
