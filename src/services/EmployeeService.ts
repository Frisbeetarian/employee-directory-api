import { getRepository } from 'typeorm';
import { Employee } from '../entities/Employee';

class EmployeeService {
    private employeeRepository = getRepository(Employee);

    public async getEmployees(): Promise<Employee[]> {
        return await this.employeeRepository.find();
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