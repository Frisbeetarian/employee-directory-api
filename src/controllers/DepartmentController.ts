import DepartmentService from '../services/DepartmentService';

class DepartmentController {
    private departmentService: DepartmentService;

    constructor(departmentService: DepartmentService) {
        this.departmentService = departmentService;
    }

    async getDepartments(req: Request, res: Response) {
        try {
            const departments = await this.departmentService.getDepartments();
            res.status(200).json(departments);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getDepartmentByUuid(req: Request, res: Response) {
        try {
            const uuid = req.params.uuid;
            const department = await this.departmentService.getDepartmentByUuid(uuid);
            res.status(200).json(department);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async createDepartment(req: Request, res: Response) {
        try {
            const department = await this.departmentService.createDepartment(req.body);
            res.status(201).json(department);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateDepartment(req: Request, res: Response) {
        try {
            const uuid = req.params.uuid;
            const department = await this.departmentService.updateDepartment(uuid, req.body);
            res.status(200).json(department);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteDepartment(req: Request, res: Response) {
        try {
            const uuid = req.params.uuid;
            await this.departmentService.deleteDepartment(uuid);
            res.status(204).end();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getEmployeesByDepartmentUuid(req: Request, res: Response) {
        try {
            const uuid = req.params.uuid;
            const employees = await this.departmentService.getEmployeesByDepartmentUuid(uuid);
            console.log('employees:', employees);
            res.status(200).json(employees);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default DepartmentController;
