import express from 'express';

import EmployeeController from '../controllers/EmployeeController';

export const employeeRouter = (controller: EmployeeController) => {
    const router = express.Router();

    router.get('/', controller.getEmployees.bind(controller));

    return router;
};

// // GET /employees - Get all employees
// // employeeRouter.get('/', EmployeeController.getEmployees)
// employeeRouter.get('/', (req, res) => employeeController.getEmployees(req, res));
// // GET /employees/:uuid - Get an employee by UUID
// employeeRouter.get('/:uuid', EmployeeController.getEmployeeByUuid)
//
// // POST /employees - Create a new employee
// employeeRouter.post('/', EmployeeController.createEmployee)
//
// // PUT /employees/:uuid - Update an employee
// employeeRouter.put('/:uuid', EmployeeController.updateEmployee);
//
// // DELETE /employees/:uuid - Delete an employee
// employeeRouter.delete('/:uuid', EmployeeController.deleteEmployee)
//
// // GET /employees/search - Search employees by criteria
// // router.get('/search', EmployeeController.searchEmployees);
//
// // GET /employees/department/:departmentUuid - Get employees by department UUID
// // router.get('/department/:departmentUuid', EmployeeController.getEmployeesByDepartmentUuid);
//
// export default employeeRouter;
