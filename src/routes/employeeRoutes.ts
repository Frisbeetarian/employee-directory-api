import express from 'express';

import EmployeeController from '../controllers/EmployeeController';

export const employeeRouter = (controller: EmployeeController) => {
    const router = express.Router();

    router.get('/', controller.getEmployees.bind(controller));

    // GET /employees/:uuid - Get an employee by UUID
    router.get('/:uuid', controller.getEmployeeByUuid.bind(controller))

    // POST /employees - Create a new employee
    router.post('/', controller.createEmployee.bind(controller))

    // PUT /employees/:uuid - Update an employee
    router.put('/:uuid', controller.updateEmployee).bind(controller);

    // DELETE /employees/:uuid - Delete an employee
    router.delete('/:uuid', controller.deleteEmployee.bind(controller))

    // GET /employees/search - Search employees by criteria
    // router.get('/search', EmployeeController.searchEmployees);

    // GET /employees/department/:departmentUuid - Get employees by department UUID
    // router.get('/department/:departmentUuid', EmployeeController.getEmployeesByDepartmentUuid);

    return router;
};
