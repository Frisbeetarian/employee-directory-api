import { Repository } from 'typeorm';
import { Location } from '../entities/Location';

class LocationService {
    private locationRepository: Repository<Location>;

    constructor(locationRepository: Repository<Location>) {
        this.locationRepository = locationRepository;
    }

    public async getLocations(): Promise<Location[]> {
        return await this.locationRepository.find();
    }

    public async getLocationByCountry(country: string): Promise<Location | null> {
        return await this.locationRepository.findOne({ where: { country } });
    }

    public async createLocation(location: Location): Promise<Location> {
        return await this.locationRepository.save(location);
    }

    public async updateLocation(uuid: string, location: Partial<Location>): Promise<Location | null> {
        await this.locationRepository.update(uuid, location);
        return await this.locationRepository.findOne(uuid);
    }

    public async deleteLocation(uuid: string): Promise<void> {
        await this.locationRepository.delete(uuid);
    }

    public async getLocationByUuid(uuid: string): Promise<Location | null> {
        return await this.locationRepository.findOne(uuid);
    }
}

export default LocationService;
