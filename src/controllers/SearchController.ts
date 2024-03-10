import { Request, Response } from 'express';
import SearchService from '../services/SearchService';

class SearchController {
    private searchService: SearchService;

    constructor(searchService: SearchService) {
        this.searchService = searchService;
    }

    async searchEmployees(req: Request, res: Response) {
        try {
            const { query } = req.query;
            const employees = await this.searchService.searchEmployees(query);
            res.status(200).json(employees);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async filterEmployeesByDepartment(req: Request, res: Response) {
        try {
            const { department } = req.query;
            const employees = await this.searchService.filterEmployeesByDepartment(department);
            res.status(200).json(employees);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default SearchController
