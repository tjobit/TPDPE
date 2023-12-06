import cheerio from "cheerio";

export function scrapGeolocInfo(html: string) {
  const $ = cheerio.load(html);

  const titles = $(".id-title-location")
    .map((index, element) => $(element).text())
    .get();

  const zipcode = titles[0].split("(")[1].split(")")[0];

  const surface = $(".id-spec")
    .map((index, element) => $(element).text())
    .get()[0]
    .split("habitable")[1]
    .split("m")[0]
    .trim();

  const dpe = $(".i-gauge-current")
    .map((index, element) => $(element).text())
    .get()[0]
    .split(" ")[0]
    .trim();

  const ges = $(".i-gauge-current")
    .map((index, element) => $(element).text())
    .get()[1]
    .split(" ")[0]
    .trim();

  return {
    dpe,
    ges,
    zipcode,
    surface,
  };
}
