import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from "../interfaces/auth.interface";
import * as controllerUtils from '../utils/controllers.utils';
import * as savedSearchService from '../services/savedSearch.service';

export async function reLaunchSavedSearch(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const connectedUser = req.user;

    controllerUtils.throwIfNotString(id);

    const searchData = await savedSearchService.reLaunchSavedSearch(id, connectedUser);

    res.status(200).json(searchData);
  } catch (error) {
    next(error);
  }
}

export async function getSavedSearches(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { page } = req.params;
    const connectedUser = req.user;

    const numPage = parseInt(page);

    controllerUtils.throwIfNotNumber(numPage);

    const savedSearchData = await savedSearchService.getSavedSearches(numPage, connectedUser);

    res.status(200).json(savedSearchData);
  } catch (error) {
    next(error);
  }
}

export async function deleteSavedSearch(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const connectedUser = req.user;

    controllerUtils.throwIfNotString(id);

    const savedSearchData = await savedSearchService.deleteSavedSearch(id, connectedUser);

    res.status(200).json(savedSearchData);
  } catch (error) {
    next(error);
  }
}