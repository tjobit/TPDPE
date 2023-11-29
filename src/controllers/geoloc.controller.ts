import { Request, Response, NextFunction } from "express";
import * as controllerUtils from "../utils/controllers.utils";
import * as geolocService from "../services/geoloc.service";

export async function getGeoloc(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { dpe, ges, zipcode, surface } = req.params;

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

    res.status(200).json(geolocData);
  } catch (error) {
    next(error);
  }
}
