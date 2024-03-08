import { Repository } from 'typeorm';

import { Skill } from '../entities/Skill';

class SkillService {
    private skillRepository: Repository<Skill>;

    constructor(skillRepository: Repository<Skill>) {
        this.skillRepository = skillRepository;
    }

    public async getSkills(): Promise<Skill[]> {
        return await this.skillRepository.find();
    }

    public async getSkillByUuid(uuid: number): Promise<Skill | null> {
        return await this.skillRepository.findOne(uuid);
    }

    public async createSkill(skill: Skill): Promise<Skill> {
        return await this.skillRepository.save(skill);
    }

    public async updateSkill(uuid: number, skill: Partial<Skill>): Promise<Skill | null> {
        await this.skillRepository.update(uuid, skill);
        return await this.skillRepository.findOne(uuid);
    }

    public async deleteSkill(uuid: number): Promise<void> {
        await this.skillRepository.delete(uuid);
    }
}

export default SkillService;
