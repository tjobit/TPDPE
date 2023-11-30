import { UserAccount } from "../interfaces/auth.interface";
import { HttpException } from "../exceptions/HttpException";
import * as geolocService from "./geoloc.service";
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

  return savedSearch;
}

export async function reLaunchSavedSearch(id: string, connectedUser: UserAccount) {
  const user = await User.findById(connectedUser.id);

  const savedSearches = user.savedSearches;

  if (!savedSearches.includes(id)) {
    throw new HttpException(404, "Saved search not found for this user");
  }

  const search = await SavedSearches.findById(id);

  if (!search) throw new HttpException(404, "Saved search not found");

  const { Etiquette_DPE, Etiquette_GES, "Code_postal_(BAN)": zipcode, Surface_habitable_logement } = search.parameters;

  const results = await geolocService.getGeoloc(Etiquette_DPE, Etiquette_GES, zipcode, Surface_habitable_logement, connectedUser);

  return results;
}

export async function getSavedSearches(
  page: number,
  connectedUser: UserAccount
) {
  const user = await User.findById(connectedUser.id);

  const savedSearches = user.savedSearches;

  const pageSavedSearches = savedSearches.slice((page - 1) * 10, page * 10);

  let searches = [];

  for (let i = 0; i < pageSavedSearches.length; i++) {
    const search = await SavedSearches.findById(pageSavedSearches[i]);
    searches.push(search);
  }

  return searches;
}

export async function deleteSavedSearch(
  id: string,
  connectedUser: UserAccount
) {
  const user = await User.findById(connectedUser.id);

  const savedSearches = user.savedSearches;

  if (!savedSearches.includes(id)) {
    throw new HttpException(404, "Saved search not found for this user");
  }

  const index = savedSearches.indexOf(id);

  savedSearches.splice(index, 1);

  await user.save();

  const search = await SavedSearches.findById(id);

  if (!search) throw new HttpException(404, "Saved search not found");

  await search.delete();
}