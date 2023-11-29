import { HttpException } from "../exceptions/HttpException";
import { UserAccount } from "../interfaces/auth.interface";
import Dep from "../models/dep";
import axios from "axios";
import { saveSearch } from "./savedSearch.service";

export async function getGeoloc(
  dpe: string,
  ges: string,
  zipcode: number,
  surface: number,
  connectedUser: UserAccount
) {
  const address = await getAddress(dpe, ges, zipcode, surface);

  let geoloc = [];

  for (let i = 0; i < address.length; i++) {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${address[i]}&format=jsonv2`
    );

    if (response.data.length > 0) {
      geoloc.push({
        address: address[i],
        latitude: response.data[0].lat,
        longitude: response.data[0].lon,
      });
    }
  }

  await saveSearch(dpe, ges, zipcode, surface, geoloc, connectedUser);

  if (geoloc.length === 0) throw new HttpException(204, "No geoloc found");

  return geoloc;
}

async function getAddress(
  dpe: string,
  ges: string,
  zipcode: number,
  surface: number
) {
  const dep = await Dep.find({
    $and: [
      { Etiquette_DPE: dpe },
      { Etiquette_GES: ges },
      { "Code_postal_(BAN)": zipcode },
      { Surface_habitable_logement: { $lte: surface + 5, $gte: surface - 5 } },
    ],
  });

  if (dep.length === 0) throw new HttpException(204, "No dep found");

  let address = [];

  dep.forEach((element) => {
    address.push(element["Adresse_(BAN)"]);
  });

  return address;
}
