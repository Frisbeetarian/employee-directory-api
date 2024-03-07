import LocationService from '../services/LocationService';

class LocationController {

    private locationService: LocationService;

    constructor(locationService: LocationService) {
        this.locationService = locationService;
    }

    static async getLocations(req: Request, res: Response) {
        try {
            const locations = await this.locationService.getLocations();
            res.status(200).json(locations);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getLocationByCountry(req: Request, res: Response) {
        try {
            const country = req.params.country;
            const location = await this.locationService.getLocationByCountry(country);
            res.status(200).json(location);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async createLocation(req: Request, res: Response) {
        try {
            const location = await this.locationService.createLocation(req.body);
            res.status(201).json(location);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async updateLocation(req: Request, res: Response) {
        try {
            const uuid = req.params.uuid;
            const location = await this.locationService.updateLocation(uuid, req.body);
            res.status(200).json(location);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async deleteLocation(req: Request, res: Response) {
        try {
            const uuid = req.params.uuid;
            await this.locationService.deleteLocation(uuid);
            res.status(204).end();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default LocationController;
