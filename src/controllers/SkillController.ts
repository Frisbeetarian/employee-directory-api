import { Request, Response } from 'express';

import SkillService from '../services/SkillService';

class SkillController {
    private skillService: SkillService;

    constructor(skillService: SkillService) {
        this.skillService = skillService;
    }

    async getSkills(_: Request, res: Response) {
        try {
            const skills = await this.skillService.getSkills();
            res.status(200).json(skills);
        } catch (error) {
            // @ts-ignore
            res.status(500).json({ message: error.message });
        }
    }

    async getSkillByUuid(req: Request, res: Response) {
        try {
            const uuid = req.params.uuid;
            const skill = await this.skillService.getSkillByUuid(uuid);
            res.status(200).json(skill);
        } catch (error) {
            // @ts-ignore
            res.status(500).json({ message: error.message });
        }
    }

    async createSkill(req: Request, res: Response) {
        try {
            const skill = req.body;
            const newSkill = await this.skillService.createSkill(skill);
            res.status(201).json(newSkill);
        } catch (error) {
            // @ts-ignore
            res.status(500).json({ message: error.message });
        }
    }

    async updateSkill(req: Request, res: Response) {
        try {
            const uuid = req.params.uuid;
            const skill = req.body;
            const updatedSkill = await this.skillService.updateSkill(uuid, skill);
            res.status(200).json(updatedSkill);
        } catch (error) {
            // @ts-ignore
            res.status(500).json({ message: error.message });
        }
    }

    async deleteSkill(req: Request, res: Response) {
        try {
            const uuid = req.params.uuid;
            await this.skillService.deleteSkill(uuid);
            res.status(204).end();
        } catch (error) {
            // @ts-ignore
            res.status(500).json({ message: error.message });
        }
    }

    async getEmployeesBySkillUuid(req: Request, res: Response) {
        try {
            const {
                page,
                limit
            } = req.query;

            const {
                employees,
                totalCount
                // @ts-ignore
            } = await this.skillService.getEmployeesBySkillUuid(req.params.uuid, page, limit);

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

export default SkillController;
