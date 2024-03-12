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

    public async getEmployeesByDepartmentUuid(uuid: string) {
        try {

            const employeeDepartments = await this.employeeDepartmentRepository.find({
                where: { department: { uuid } },
                relations: ['employee'],
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

                return employees;
            }
        } catch (error) {
            console.log(error);
            return [];

        }
    }
}

export default DepartmentService
