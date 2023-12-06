import { HttpException } from "../exceptions/HttpException";
import Dep from "../models/dep";
import axios from "axios";
import { scrapGeolocInfo } from "../utils/geoloc.utils";

export async function getGeoloc(
  dpe: string,
  ges: string,
  zipcode: number,
  surface: number
) {
  const address = await getAddress(dpe, ges, zipcode, surface);

  let geoloc = [];

  for (let i = 0; i < address.length; i++) {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${address[i]}&format=jsonv2`
    );

    if(response.status !== 200) throw new HttpException(400, "Can't access to this link");

    if (response.data.length > 0) {
      geoloc.push({
        address: address[i],
        latitude: response.data[0].lat,
        longitude: response.data[0].lon,
      });
    }
  }

  if (geoloc.length === 0) throw new HttpException(204, "No geoloc found");

  return geoloc;
}

export async function getAddress(
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

export async function getGeolocLink(link: string) {
  const response = await axios.get(link, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  });

  if(response.status !== 200) throw new HttpException(400, "Can't access to this link");

  const geolocInfos = scrapGeolocInfo(response.data);
  
  const geoloc = await getGeoloc(
    geolocInfos.dpe,
    geolocInfos.ges,
    parseInt(geolocInfos.zipcode),
    parseInt(geolocInfos.surface)
  );

  console.log(geoloc)

  return {
    dpe: geolocInfos.dpe,
    ges: geolocInfos.ges,
    zipcode: geolocInfos.zipcode,
    surface: geolocInfos.surface,
    geoloc
  };
}
