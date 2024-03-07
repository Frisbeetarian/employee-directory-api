class SkillController {
    private skillService: SkillService;

    constructor(skillService: SkillService) {
        this.skillService = skillService;
    }

    static async getSkills(req: Request, res: Response) {
        try {
            const skills = await this.skillService.getSkills();
            res.status(200).json(skills);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getSkillByUuid(req: Request, res: Response) {
        try {
            const uuid = req.params.uuid;
            const skill = await this.skillService.getSkillByUuid(uuid);
            res.status(200).json(skill);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async createSkill(req: Request, res: Response) {
        try {
            const skill = req.body;
            const newSkill = await this.skillService.createSkill(skill);
            res.status(201).json(newSkill);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async updateSkill(req: Request, res: Response) {
        try {
            const uuid = req.params.uuid;
            const skill = req.body;
            const updatedSkill = await this.skillService.updateSkill(uuid, skill);
            res.status(200).json(updatedSkill);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async deleteSkill(req: Request, res: Response) {
        try {
            const uuid = req.params.uuid;
            await this.skillService.deleteSkill(uuid);
            res.status(204).end();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default SkillController;