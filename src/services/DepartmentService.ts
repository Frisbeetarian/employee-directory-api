import { Repository } from 'typeorm';
import { Department } from '../entities/Department';
import { Employee } from '../entities/Employee';

class DepartmentService {
    private departmentRepository: Repository<Department>;

    constructor(departmentRepository: Repository<Department>) {
        this.departmentRepository = departmentRepository;
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
}

export default DepartmentService
