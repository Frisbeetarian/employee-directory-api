import { In, Repository } from 'typeorm';
import { Department } from '../entities/Department';
import { Employee } from '../entities/Employee';
import { EmployeeDepartment } from '../entities/EmployeeDepartment';

class DepartmentService {
    private departmentRepository: Repository<Department>;
    private employeeRepository: Repository<Employee>;
    private employeeDepartmentRepository: Repository<EmployeeDepartment>;

    constructor(departmentRepository: Repository<Department>,
                employeeRepository: Repository<Employee>,
                employeeDepartmentRepository: Repository<EmployeeDepartment>
    ) {
        this.departmentRepository = departmentRepository;
        this.employeeRepository = employeeRepository;
        this.employeeDepartmentRepository = employeeDepartmentRepository;
    }

    public async getDepartments(): Promise<Department[]> {
        return await this.departmentRepository.find();
    }

    public async getDepartmentByUuid(uuid: string): Promise<Department | null> {
        return await this.departmentRepository.findOne(uuid);
    }

    public async createDepartment(department: Department): Promise<Department> {
        return await this.departmentRepository.save(department);
    }

    public async updateDepartment(uuid: string, department: Partial<Department>): Promise<Department | null> {
        await this.departmentRepository.update(uuid, department);
        return await this.departmentRepository.findOne(uuid);
    }

    public async deleteDepartment(uuid: string): Promise<void> {
        await this.departmentRepository.delete(uuid);
    }

    public async getEmployeesByDepartmentUuid(uuid: string, page: number, limit: number) {
        try {

            const skip = (page - 1) * limit;

            const [
                employeeDepartments,
                totalCount
            ] = await this.employeeDepartmentRepository.findAndCount({
                where: { department: { uuid } },
                relations: ['employee'],
                skip,
                take: limit
            });

            const employeeUuids = employeeDepartments.map(ed => ed.employee.uuid);

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

export default DepartmentService
