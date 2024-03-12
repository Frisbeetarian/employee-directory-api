import express from 'express'

import LocationController from '../controllers/LocationController'

export const locationRouter = (controller: LocationController) => {
    const router = express.Router();

    // GET /locations - Get all locations
    router.get('/', controller.getLocations.bind(controller))

    // GET /locations/:country - Get a project by Country
    router.get('/:country', controller.getLocationByCountry.bind(controller))

    // POST /locations - Create a new location
    router.post('/', controller.createLocation.bind(controller))

    // PUT /locations/:uuid - Update a location
    router.put('/:uuid', controller.updateLocation.bind(controller))

    // DELETE /locations/:uuid - Delete a location
    router.delete('/:uuid', controller.deleteLocation.bind(controller))

    // GET /locations/:uuid/employees - Get employees by location UUID
    router.get('/:uuid/employees', controller.getEmployeesByLocationUuid.bind(controller))

    return router;
};
