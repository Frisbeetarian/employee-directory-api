import express from 'express';

import ProjectController from '../controllers/ProjectController';

const projectRouter = express.Router();

// GET /projects - Get all projects
projectRouter.get('/', ProjectController.getProjects)

// GET /projects/:uuid - Get a project by UUID
projectRouter.get('/:uuid', ProjectController.getProjectByUuid)

// POST /projects - Create a new project
projectRouter.post('/', ProjectController.createProject)

// PUT /projects/:uuid - Update a project
projectRouter.put('/:uuid', ProjectController.updateProject);

// DELETE /projects/:uuid - Delete a project
projectRouter.delete('/:uuid', ProjectController.deleteProject)

export default projectRouter;
