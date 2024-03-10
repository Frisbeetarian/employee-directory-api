import { Request, Response } from 'express';
import { SearchService } from '../services/SearchService';

class SearchController {
    private searchService: SearchService;

    constructor(searchService: SearchService) {
        this.searchService = searchService;
    }

    async searchEmployees(req: Request, res: Response) {
        const { query } = req.query;
        const employees = await this.searchService.searchEmployees(query);
        res.json(employees);
    }

    async filterEmployeesByDepartment(req: Request, res: Response) {
        const { department } = req.query;
        const employees = await this.searchService.filterEmployeesByDepartment(department);
        res.json(employees);
    }
}
