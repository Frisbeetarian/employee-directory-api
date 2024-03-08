import express from 'express';
import DepartmentController from '../controllers/DepartmentController';

export const departmentRouter = (controller: DepartmentController) => {
    const router = express.Router();

    // GET /departments - Get all departments
    router.get('/', controller.getDepartments.bind(controller));

    // GET /departments/:uuid - Get a department by UUID
    router.get('/:uuid', controller.getDepartmentByUuid.bind(controller))

    // POST /departments - Create a new department
    router.post('/', controller.createDepartment.bind(controller))

    // PUT /departments/:uuid - Update a department
    router.put('/:uuid', controller.updateDepartment).bind(controller);

    // DELETE /departments/:uuid - Delete a department
    router.delete('/:uuid', controller.deleteDepartment.bind(controller))

    return router;
};

