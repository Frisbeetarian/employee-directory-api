import { Request, Response } from 'express';
import SearchService from '../services/SearchService';

class SearchController {
    private searchService: SearchService;

    constructor(searchService: SearchService) {
        this.searchService = searchService;
    }

    async searchEmployees(req: Request, res: Response) {
        try {
            // @ts-ignore
            const employees = await this.searchService.searchEmployees(req.query.query);
            res.status(200).json(employees);
        } catch (error) {
            // @ts-ignore
            res.status(500).json({ message: error.message });
        }
    }

}

export default SearchController
