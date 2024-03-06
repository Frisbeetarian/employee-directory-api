import { getRepository } from 'typeorm';
import { Department } from '../entities/Department';

class DepartmentService {
    private departmentRepository = getRepository(Department);

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
