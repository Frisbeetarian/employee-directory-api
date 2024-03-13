import { getConnection, In, Repository } from 'typeorm';

import { Employee } from '../entities/Employee';
import { EmployeeDepartment } from '../entities/EmployeeDepartment';
import { EmployeeSkill } from '../entities/EmployeeSkill';
import { EmployeeProject } from '../entities/EmployeeProject';
import { EmployeeLocation } from '../entities/EmployeeLocation';
import { AppDataSource } from '../index';
import { Department } from '../entities/Department';
import { Project } from '../entities/Project';
import { Skill } from '../entities/Skill';
import { Location } from '../entities/Location';
import SearchService from './SearchService';

class EmployeeService {
    private employeeRepository: Repository<Employee>;
    private departmentRepository: Repository<Department>;
    private locationRepository: Repository<Location>;
    private projectRepository: Repository<Project>;
    private skillRepository: Repository<Skill>;
    private employeeDepartmentRepository: Repository<EmployeeDepartment>;
    private employeeProjectRepository: Repository<EmployeeProject>;
    private employeeSkillRepository: Repository<EmployeeSkill>;
    private employeeLocationRepository: Repository<EmployeeLocation>;

    constructor(employeeRepository: Repository<Employee>,
                departmentRepository: Repository<Department>,
                locationRepository: Repository<Location>,
                projectRepository: Repository<Project>,
                skillRepository: Repository<Skill>,
                employeeDepartmentRepository: Repository<EmployeeDepartment>,
                employeeProjectRepository: Repository<EmployeeProject>,
                employeeSkillRepository: Repository<EmployeeSkill>,
                employeeLocationRepository: Repository<EmployeeLocation>,
    ) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.locationRepository = locationRepository;
        this.projectRepository = projectRepository;
        this.skillRepository = skillRepository;
        this.employeeDepartmentRepository = employeeDepartmentRepository;
        this.employeeProjectRepository = employeeProjectRepository;
        this.employeeSkillRepository = employeeSkillRepository;
        this.employeeLocationRepository = employeeLocationRepository;
    }

    public async getEmployees(page: number, limit: number): Promise<{ employees: any[], totalCount: number }> {
        try {
            const skip = (page - 1) * limit;

            const [
                employees,
                totalCount
            ] = await this.employeeRepository.findAndCount({
                relations: [
                    'employeeDepartments.department',
                    'employeeLocations.location',
                    'employeeProjects.project',
                    'employeeSkills.skill'
                ],
                skip,
                take: limit,
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
        } catch (error) {
            throw error;
        }
    }

    public async getEmployeeByUuid(uuid: number): Promise<Employee | null> {
        return await this.employeeRepository.findOne(uuid);
    }

    public async createEmployee(employee: Employee): Promise<Employee> {
        const queryRunner = this.employeeRepository.manager.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const employeeToSave = new Employee();
            employeeToSave.name = employee.name;
            employeeToSave.firstName = employee.firstName;
            employeeToSave.lastName = employee.lastName;
            employeeToSave.email = employee.email;
            employeeToSave.phoneNumber = employee.phoneNumber;
            employeeToSave.jobTitle = employee.jobTitle;
            employeeToSave.biography = employee?.biography;
            employeeToSave.picture = employee?.picture;
            employeeToSave.hireDate = employee?.hireDate;

            const savedEmployee = await queryRunner.manager.save(employeeToSave);

            if (employee.selectedDepartments && employee.selectedDepartments.length) {
                const departments = await queryRunner.manager.getRepository(Department).findBy({
                    uuid: In(employee.selectedDepartments)
                });

                for (const department of departments) {
                    const employeeDepartment = new EmployeeDepartment();
                    employeeDepartment.employee = savedEmployee;
                    employeeDepartment.department = department;
                    await queryRunner.manager.getRepository(EmployeeDepartment).save(employeeDepartment);
                }
            }

            if (employee.selectedProjects && employee.selectedProjects.length) {
                const projects = await queryRunner.manager.getRepository(Project).findBy({
                    uuid: In(employee.selectedProjects)
                });

                for (const project of projects) {
                    const employeeProject = new EmployeeProject();
                    employeeProject.employee = savedEmployee;
                    employeeProject.project = project;
                    await queryRunner.manager.getRepository(EmployeeProject).save(employeeProject);
                }
            }

            if (employee.selectedSkills && employee.selectedSkills.length) {
                const skills = await queryRunner.manager.getRepository(Skill).findBy({
                    uuid: In(employee.selectedSkills)
                });

                for (const skill of skills) {
                    const employeeSkill = new EmployeeSkill();
                    employeeSkill.employee = savedEmployee;
                    employeeSkill.skill = skill;
                    await queryRunner.manager.getRepository(EmployeeSkill).save(employeeSkill);
                }
            }

            if (employee.selectedLocations && employee.selectedLocations.length) {
                const locations = await queryRunner.manager.getRepository(Location).findBy({
                    uuid: In(employee.selectedLocations)
                });

                for (const location of locations) {
                    const employeeLocation = new EmployeeLocation();
                    employeeLocation.employee = savedEmployee;
                    employeeLocation.location = location;
                    await queryRunner.manager.getRepository(EmployeeLocation).save(employeeLocation);
                }
            }

            await queryRunner.commitTransaction();

            const employeeToSend = await this.employeeRepository.findOne({
                where: { uuid: savedEmployee.uuid },
                relations: [
                    'employeeDepartments.department',
                    'employeeSkills.skill',
                    'employeeProjects.project',
                    'employeeLocations.location'
                ]
            });

            const searchService = new SearchService();
            await searchService.indexEmployees([employeeToSend]);

            return {
                uuid: employeeToSend?.uuid,
                name: employeeToSend?.name,
                email: employeeToSend?.email,
                phoneNumber: employeeToSend?.phoneNumber,
                hireDate: employeeToSend?.hireDate,
                jobTitle: employeeToSend?.jobTitle,
                picture: employeeToSend?.picture,
                biography: employeeToSend?.biography,
                updatedAt: employeeToSend?.updatedAt,
                createdAt: employeeToSend?.createdAt,
                departments: employeeToSend?.employeeDepartments?.map(employeeDepartment => ({
                    uuid: employeeDepartment.uuid,
                    name: employeeDepartment.department.name
                })),
                locations: employeeToSend?.employeeLocations?.map(employeeLocation => ({
                    uuid: employeeLocation.uuid,
                    name: employeeLocation.location.name
                })),
                projects: employeeToSend?.employeeProjects?.map(employeeProject => ({
                    uuid: employeeProject.uuid,
                    name: employeeProject.project.name
                })),
                skills: employeeToSend?.employeeSkills?.map(employeeSkill => ({
                    uuid: employeeSkill.uuid,
                    name: employeeSkill.skill.name
                }))
            }

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    public async updateEmployee(uuid: number, employee: Partial<Employee>): Promise<Employee | null> {
        await this.employeeRepository.update(uuid, employee);
        return await this.employeeRepository.findOne(uuid);
    }

    public async deleteEmployee(uuid: string): Promise<void> {
        const queryRunner = AppDataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.delete(EmployeeDepartment, { employee: { uuid } });
            await queryRunner.manager.delete(EmployeeSkill, { employee: { uuid } });
            await queryRunner.manager.delete(EmployeeProject, { employee: { uuid } });
            await queryRunner.manager.delete(EmployeeLocation, { employee: { uuid } });

            await queryRunner.manager.delete(Employee, { uuid });

            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
            const searchService = new SearchService();
            await searchService.removeEmployeeFromIndex(uuid);
        }
    }

    public async searchEmployees(criteria: Partial<Employee>): Promise<Employee[]> {
        return await this.employeeRepository.find(criteria);
    }
}

export default EmployeeService;
