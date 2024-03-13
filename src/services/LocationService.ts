import { In, Repository } from 'typeorm';
import { Location } from '../entities/Location';
import { Employee } from '../entities/Employee';
import { EmployeeLocation } from '../entities/EmployeeLocation';
import { EmployeeDepartment } from '../entities/EmployeeDepartment';

class LocationService {
    private locationRepository: Repository<Location>;
    private employeeRepository: Repository<Employee>;
    private employeeLocationRepository: Repository<EmployeeLocation>;

    constructor(locationRepository: Repository<Location>,
                employeeRepository: Repository<Employee>,
                employeeLocationRepository: Repository<EmployeeLocation>
    ) {
        this.locationRepository = locationRepository;
        this.employeeRepository = employeeRepository;
        this.employeeLocationRepository = employeeLocationRepository;
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

    public async getEmployeesByLocationUuid(uuid: string, page: number, limit: number) {
        try {

            const skip = (page - 1) * limit;

            const [
                employeeLocations,
                totalCount
            ] = await this.employeeLocationRepository.findAndCount({
                where: { location: { uuid } },
                relations: ['employee'],
                skip,
                take: limit
            });

            const employeeUuids = employeeLocations.map(el => el.employee.uuid);

            if (employeeUuids.length > 0) {
                const employees = await this.employeeRepository.find({
                    where: { uuid: In(employeeUuids) },
                    relations: [
                        'employeeDepartments.department',
                        'employeeSkills.skill',
                        'employeeProjects.project',
                        'employeeLocations.location'
                    ],
                });

                const employeesToSend = employees.map(
                    employee => ({
                        uuid: employee.uuid,
                        name: employee.name,
                        email: employee.email,
                        phoneNumber: employee.phoneNumber,
                        hireDate: employee.hireDate,
                        jobTitle: employee.jobTitle,
                        picture: employee.picture,
                        biography: employee.biography,
                        updatedAt: employee.updatedAt,
                        createdAt: employee.createdAt,
                        departments: employee.employeeDepartments?.map(employeeDepartment => ({
                            uuid: employeeDepartment.uuid,
                            name: employeeDepartment.department.name
                        })),
                        locations: employee.employeeLocations?.map(employeeLocation => ({
                            uuid: employeeLocation.uuid,
                            name: employeeLocation.location.name
                        })),
                        skills: employee.employeeSkills?.map(employeeSkill => ({
                            uuid: employeeSkill.uuid,
                            name: employeeSkill.skill.name
                        }))
                    })
                );

                return { employees: employeesToSend, totalCount };
            }
        } catch (error) {
            console.log(error);
            return [];

        }
    }
}

export default LocationService;
