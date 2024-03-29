import { Request, Response } from 'express';

import EmployeeService from '../services/EmployeeService';

class EmployeeController {
    private employeeService: EmployeeService;

    constructor(employeeService: EmployeeService) {
        this.employeeService = employeeService;
    }

    async getEmployees(req: Request, res: Response) {
        try {

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 12;

            const {
                employees,
                totalCount
            } = await this.employeeService.getEmployees(page, limit);

            res.status(200).json({
                employees,
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
            });
        } catch (error) {
            // @ts-ignore
            console.log('Get employees error:', error.message)
            // @ts-ignore
            res.status(500).json({ message: error.message });
        }
    }

    async getEmployeeByUuid(req: Request, res: Response) {
        try {
            const uuid = req.params.uuid;
            const employee = await this.employeeService.getEmployeeByUuid(uuid);
            res.status(200).json(employee);
        } catch (error) {
            // @ts-ignore
            res.status(500).json({ message: error.message });
        }
    }

    async createEmployee(req: Request, res: Response) {
        try {
            const employee = req.body;
            const newEmployee = await this.employeeService.createEmployee(employee);
            res.status(201).json(newEmployee);
        } catch (error) {
            // @ts-ignore
            console.log('error:', error.message)
            // @ts-ignore
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
            // @ts-ignore
            res.status(500).json({ message: error.message });
        }
    }

    async deleteEmployee(req: Request, res: Response) {
        try {
            const uuid = req.params.uuid;
            await this.employeeService.deleteEmployee(uuid);
            res.status(204).end();
        } catch (error) {
            // @ts-ignore
            res.status(500).json({ message: error.message });
        }
    }

}

export default EmployeeController;
