import { getRepository } from 'typeorm';
import { Project } from '../entities/Project';

class ProjectService {
    private projectRepository = getRepository(Project);

    public async getProjects(): Promise<Project[]> {
        return await this.projectRepository.find();
    }

    public async getProjectByUuid(uuid: number): Promise<Project | null> {
        return await this.projectRepository.findOne(uuid);
    }

    public async createProject(project: Project): Promise<Project> {
        return await this.projectRepository.save(project);
    }

    public async updateProject(uuid: number, project: Partial<Project>): Promise<Project | null> {
        await this.projectRepository.update(uuid, project);
        return await this.projectRepository.findOne(uuid);
    }

    public async deleteProject(uuid: number): Promise<void> {
        await this.projectRepository.delete(uuid);
    }
}

export default ProjectService;
