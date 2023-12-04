import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../interfaces/auth.interface";
import * as controllerUtils from "../utils/controllers.utils";
import * as geolocService from "../services/geoloc.service";
import { saveSearch } from "../services/savedSearch.service";

interface CustomRequest extends Request {
  user: any;
}

export async function getGeoloc(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { dpe, ges, zipcode, surface } = req.params;

    const connectedUser = req.user;

    const numZipcode = parseInt(zipcode);
    const numSurface = parseInt(surface);

    controllerUtils.throwIfNotString(dpe, ges);
    controllerUtils.throwIfNotNumber(numZipcode, numSurface);

    const geolocData = await geolocService.getGeoloc(
      dpe,
      ges,
      numZipcode,
      numSurface
    );

    await saveSearch(
      dpe,
      ges,
      numZipcode,
      numSurface,
      geolocData,
      connectedUser
    );

    res.status(200).json(geolocData);
  } catch (error) {
    next(error);
  }
}
