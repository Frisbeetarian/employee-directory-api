import express from 'express';

import ProjectController from '../controllers/ProjectController';

export const projectRouter = (controller: ProjectController) => {
    const router = express.Router();

    // GET /projects - Get all projects
    router.get('/', controller.getProjects.bind(controller))

    // GET /projects/:uuid - Get a project by UUID
    router.get('/:uuid', controller.getProjectByUuid.bind(controller))

    // POST /projects - Create a new project
    router.post('/', controller.createProject.bind(controller))

    // PUT /projects/:uuid - Update a project
    router.put('/:uuid', controller.updateProject).bind(controller);

    // DELETE /projects/:uuid - Delete a project
    router.delete('/:uuid', controller.deleteProject.bind(controller))
    return router;
};
