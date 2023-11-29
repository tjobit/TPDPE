import { UserAccount } from "../interfaces/auth.interface";
import { HttpException } from "../exceptions/HttpException";
import SavedSearches from "../models/savedSearches";
import User from "../models/users";

export async function saveSearch(
  dpe: string,
  ges: string,
  zipcode: number,
  surface: number,
  results: any,
  connectedUser: UserAccount
) {
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

export async function getSavedSearch(page: number, connectedUser: UserAccount) {
  const user = await User.findById(connectedUser.id);

  const savedSearches = user.savedSearches;

  if (page > savedSearches.length) {
    throw new HttpException(204, "Page number too high");
  }

  const pageSavedSearches = savedSearches.slice((page - 1) * 10, page * 10);

  let searches = [];

  for (let i = 0; i < pageSavedSearches.length; i++) {
    const search = await SavedSearches.findById(pageSavedSearches[i]);
    searches.push(search);
  }

  return searches;
}
