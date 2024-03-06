import express from 'express';
import DepartmentController from '../controllers/DepartmentController';

const departmentRouter = express.Router();

// GET /departments - Get all departments
departmentRouter.get('/', DepartmentController.getDepartments)

// GET /departments/:uuid - Get a department by UUID
departmentRouter.get('/:uuid', DepartmentController.getDepartmentByUuid)

// POST /departments - Create a new department
departmentRouter.post('/', DepartmentController.createDepartment)

// PUT /departments/:uuid - Update a department
departmentRouter.put('/:uuid', DepartmentController.updateDepartment);

// DELETE /departments/:uuid - Delete a department
departmentRouter.delete('/:uuid', DepartmentController.deleteDepartment)

export default departmentRouter;
