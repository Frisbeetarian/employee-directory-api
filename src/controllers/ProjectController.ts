import { Request, Response } from 'express';

import ProjectService from '../services/ProjectService';

class ProjectController {
    private projectService: ProjectService;

    constructor(projectService: ProjectService) {
        this.projectService = projectService;
    }

    async getProjects(_: Request, res: Response) {
        try {
            const projects = await this.projectService.getProjects();
            res.status(200).json(projects);
        } catch (error) {
            // @ts-ignore
            res.status(500).json({ message: error.message });
        }
    }

    async getProjectByUuid(req: Request, res: Response) {
        try {
            const uuid = req.params.uuid;
            // @ts-ignore
            const project = await this.projectService.getProjectByUuid(uuid);
            res.status(200).json(project);
        } catch (error) {
            // @ts-ignore
            res.status(500).json({ message: error.message });
        }
    }

    async createProject(req: Request, res: Response) {
        try {
            const project = req.body;
            const newProject = await this.projectService.createProject(project);
            res.status(201).json(newProject);
        } catch (error) {
            // @ts-ignore
            res.status(500).json({ message: error.message });
        }
    }

    async updateProject(req: Request, res: Response) {
        try {
            const uuid = req.params.uuid;
            const project = req.body;
            // @ts-ignore
            const updatedProject = await this.projectService.updateProject(uuid, project);
            res.status(200).json(updatedProject);
        } catch (error) {
            // @ts-ignore
            res.status(500).json({ message: error.message });
        }
    }

    async deleteProject(req: Request, res: Response) {
        try {
            const uuid = req.params.uuid;
            // @ts-ignore
            await this.projectService.deleteProject(uuid);
            res.status(204).end();
        } catch (error) {
            // @ts-ignore
            res.status(500).json({ message: error.message });
        }
    }

    async getEmployeesByProjectUuid(req: Request, res: Response) {
        try {
            const {
                page,
                limit
            } = req.query;

            const {
                employees,
                totalCount
                // @ts-ignore
            } = await this.projectService.getEmployeesByProjectUuid(req.params.uuid, page, limit);

            res.status(200).json({
                employees,
                currentPage: page,
                // @ts-ignore
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
            });
        } catch (error) {
            // @ts-ignore
            res.status(500).json({ message: error.message });

        }
    }
}

export default ProjectController;
