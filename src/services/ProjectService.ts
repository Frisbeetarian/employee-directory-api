import { In, Repository } from 'typeorm';
import { Project } from '../entities/Project';
import { Employee } from '../entities/Employee';
import { EmployeeProject } from '../entities/EmployeeProject';

class ProjectService {
    private projectRepository: Repository<Project>;
    private employeeRepository: Repository<Employee>;
    private employeeProjectRepository: Repository<EmployeeProject>;

    constructor(projectRepository: Repository<Project>, employeeRepository: Repository<Employee>, employeeProjectRepository: Repository<EmployeeProject>) {
        this.projectRepository = projectRepository;
        this.employeeRepository = employeeRepository;
        this.employeeProjectRepository = employeeProjectRepository;
    }

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

    public async getEmployeesByProjectUuid(uuid: string, page: number, limit: number) {
        try {

            const skip = (page - 1) * limit;

            const [
                employeeProjects,
                totalCount
            ] = await this.employeeProjectRepository.findAndCount({
                where: { project: { uuid } },
                relations: ['employee'],
                skip,
                take: limit
            });

            const employeeUuids = employeeProjects.map(el => el.employee.uuid);

            if (employeeUuids.length > 0) {
                const employees = await this.employeeRepository.find({
                    where: { uuid: In(employeeUuids) },
                    relations: [
                        'employeeDepartments.department',
                        'employeeSkills.skill',
                        'employeeProjects.project',
                        'employeeLocations.location'
                    ],
                });

                const employeesToSend = employees.map(
                    employee => ({
                        uuid: employee.uuid,
                        name: employee.name,
                        email: employee.email,
                        phoneNumber: employee.phoneNumber,
                        hireDate: employee.hireDate,
                        jobTitle: employee.jobTitle,
                        picture: employee.picture,
                        biography: employee.biography,
                        updatedAt: employee.updatedAt,
                        createdAt: employee.createdAt,
                        departments: employee.employeeDepartments?.map(employeeDepartment => ({
                            uuid: employeeDepartment.uuid,
                            name: employeeDepartment.department.name
                        })),
                        locations: employee.employeeLocations?.map(employeeLocation => ({
                            uuid: employeeLocation.uuid,
                            name: employeeLocation.location.name
                        })),
                        projects: employee.employeeProjects?.map(employeeProject => ({
                            uuid: employeeProject.uuid,
                            name: employeeProject.project.name
                        })),
                        skills: employee.employeeSkills?.map(employeeSkill => ({
                            uuid: employeeSkill.uuid,
                            name: employeeSkill.skill.name
                        }))
                    })
                );

                return { employees: employeesToSend, totalCount };
            }
        } catch (error) {
            console.log(error);
            return [];
        }
    }
}

export default ProjectService;
