import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from "../interfaces/auth.interface";
import * as controllerUtils from '../utils/controllers.utils';
import * as savedSearchService from '../services/savedSearch.service';

export async function getSavedSearch(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { page } = req.params;
    const connectedUser = req.user;

    const numPage = parseInt(page);

    controllerUtils.throwIfNotNumber(numPage);

    const savedSearchData = await savedSearchService.getSavedSearch(numPage, connectedUser);

    res.status(200).json(savedSearchData);
  } catch (error) {
    next(error);
  }
}