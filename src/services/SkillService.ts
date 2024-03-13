import { In, Repository } from 'typeorm';

import { Skill } from '../entities/Skill';
import { Employee } from '../entities/Employee';
import { EmployeeSkill } from '../entities/EmployeeSkill';

class SkillService {
    private skillRepository: Repository<Skill>;
    private employeeRepository: Repository<Employee>;
    private employeeSkillRepository: Repository<EmployeeSkill>;

    constructor(skillRepository: Repository<Skill>, employeeRepository: Repository<Employee>, employeeSkillRepository: Repository<EmployeeSkill>) {
        this.skillRepository = skillRepository;
        this.employeeRepository = employeeRepository;
        this.employeeSkillRepository = employeeSkillRepository;
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

    public async getEmployeesBySkillUuid(uuid: string, page: number, limit: number) {
        try {
            const skip = (page - 1) * limit;

            const [
                employeeSkills,
                totalCount
            ] = await this.employeeSkillRepository.findAndCount({
                where: { skill: { uuid } },
                relations: ['employee'],
                skip,
                take: limit
            });

            const employeeUuids = employeeSkills.map(el => el.employee.uuid);

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

export default SkillService;
