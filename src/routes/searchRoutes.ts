import express from 'express';

import SearchController from '../controllers/SearchController';

export const searchRouter = (controller: SearchController) => {
    const router = express.Router();

    // GET /employees - Get all employees
    router.get('/employees', controller.searchEmployees.bind(controller))

    return router;
};
