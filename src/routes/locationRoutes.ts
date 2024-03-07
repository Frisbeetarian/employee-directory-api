import express from 'express'

import LocationController from '../controllers/LocationController'

const locationRouter = express.Router()

// GET /locations - Get all locations
locationRouter.get('/', LocationController.getLocations)

// GET /locations/:country - Get a project by Country
locationRouter.get('/:country', LocationController.getLocationByCountry)

// POST /locations - Create a new location
locationRouter.post('/', LocationController.createLocation)

// PUT /locations/:uuid - Update a location
locationRouter.put('/:uuid', LocationController.updateLocation);

// DELETE /locations/:uuid - Delete a location
locationRouter.delete('/:uuid', LocationController.deleteLocation)

export default locationRouter
