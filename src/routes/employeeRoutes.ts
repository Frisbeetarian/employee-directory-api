import express from 'express';
import EmployeeController from '../controllers/EmployeeController';

const router = express.Router();

// GET /employees - Get all employees
router.get('/', EmployeeController.getEmployees)

// GET /employees/:uuid - Get an employee by UUID
router.get('/:uuid', EmployeeController.getEmployeeByUuid)

// POST /employees - Create a new employee
router.post('/', EmployeeController.createEmployee)

// PUT /employees/:uuid - Update an employee
router.put('/:uuid', EmployeeController.updateEmployee);

// DELETE /employees/:uuid - Delete an employee
router.delete('/:uuid', EmployeeController.deleteEmployee)

// GET /employees/search - Search employees by criteria
// router.get('/search', EmployeeController.searchEmployees);

// GET /employees/department/:departmentUuid - Get employees by department UUID
// router.get('/department/:departmentUuid', EmployeeController.getEmployeesByDepartmentUuid);

export default router;
