import e, { Router } from 'express';
import * as geolocController from '../controllers/geoloc.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { errorMiddleware } from '../middlewares/error.middleware';

export function getRouter() {
    const router = Router();
    
    router.get('/geoloc/:dpe/:ges/:zipcode/:surface', authMiddleware, geolocController.getGeoloc, errorMiddleware);
    router.post('/geoloc', authMiddleware, geolocController.getGeolocLink, errorMiddleware);
    
    return router;
}

