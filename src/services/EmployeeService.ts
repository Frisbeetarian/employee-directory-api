import { Repository } from 'typeorm';

import { Employee } from '../entities/Employee';

class EmployeeService {
    private employeeRepository: Repository<Employee>;

    constructor(employeeRepository: Repository<Employee>) {
        this.employeeRepository = employeeRepository;
    }

    public async getEmployees(page: number, limit: number): Promise<{ employees: any[], totalCount: number }> {
        const skip = (page - 1) * limit;

        const [
            employees,
            totalCount
        ] = await this.employeeRepository.findAndCount({
            relations: [
                'employeeDepartments.department',
                'employeeLocations.location',
                'employeeProjects.project',
                'employeeSkills.skill'
            ],
            skip,
            take: limit,
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
                projects: employee.employeeProjects?.map(employeeProject => ({
                    uuid: employeeProject.uuid,
                    name: employeeProject.project.name
                })),
                skills: employee.employeeSkills?.map(employeeSkill => ({
                    uuid: employeeSkill.uuid,
                    name: employeeSkill.skill.name
                }))
            })
        );

        return { employees: employeesToSend, totalCount };
    }

    public async getEmployeeByUuid(uuid: number): Promise<Employee | null> {
        return await this.employeeRepository.findOne(uuid);
    }

    public async createEmployee(employee: Employee): Promise<Employee> {
        return await this.employeeRepository.save(employee);
    }

    public async updateEmployee(uuid: number, employee: Partial<Employee>): Promise<Employee | null> {
        await this.employeeRepository.update(uuid, employee);
        return await this.employeeRepository.findOne(uuid);
    }

    public async deleteEmployee(uuid: number): Promise<void> {
        await this.employeeRepository.delete(uuid);
    }

    public async searchEmployees(criteria: Partial<Employee>): Promise<Employee[]> {
        return await this.employeeRepository.find(criteria);
    }
}

export default EmployeeService;
