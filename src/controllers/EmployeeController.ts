import EmployeeService from '../services/EmployeeService';

class EmployeeController {
    private employeeService: EmployeeService;

    constructor(employeeService: EmployeeService) {
        this.employeeService = employeeService;
    }

    async getEmployees(req: Request, res: Response) {
        try {
            const employees = await this.employeeService.getEmployees();
            res.status(200).json(employees);
        } catch (error) {
            console.log('Get employees error:', error.message)
            res.status(500).json({ message: error.message });
        }
    }

    async getEmployeeByUuid(req: Request, res: Response) {
        try {
            const uuid = req.params.uuid;
            const employee = await this.employeeService.getEmployeeByUuid(uuid);
            res.status(200).json(employee);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async createEmployee(req: Request, res: Response) {
        try {
            const employee = req.body;
            const newEmployee = await this.employeeService.createEmployee(employee);
            res.status(201).json(newEmployee);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateEmployee(req: Request, res: Response) {
        try {
            const uuid = req.params.uuid;
            const employee = req.body;
            const updatedEmployee = await this.employeeService.updateEmployee(uuid, employee);
            res.status(200).json(updatedEmployee);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteEmployee(req: Request, res: Response) {
        try {
            const uuid = req.params.uuid;
            await this.employeeService.deleteEmployee(uuid);
            res.status(204).end();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async searchEmployees(req: Request, res: Response) {
        try {
            const criteria = req.query;
            const employees = await this.employeeService.searchEmployees(criteria);
            res.status(200).json(employees);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default EmployeeController;
