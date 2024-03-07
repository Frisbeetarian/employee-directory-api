import dotenv from 'dotenv';

import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';

import { Employee } from '../src/entities/Employee';
import { Department } from '../src/entities/Department';
import { EmployeeDepartment } from '../src/entities/EmployeeDepartment';
import { Project } from '../src/entities/Project';
import { EmployeeProject } from '../src/entities/EmployeeProject';
import { Skill } from '../src/entities/Skill';
import { EmployeeSkill } from '../src/entities/EmployeeSkill';

dotenv.config();

const numberOfEmployees = 150;
const numberOfDepartments = 5;
const numberOfProjects = 10;
const numberOfSkills = 20;

async function generateData() {
    const AppDataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: Number(process.env.POSTGRESQL_PORT),
        username: process.env.POSTGRESQL_USERNAME,
        password: process.env.POSTGRESQL_PASSWORD,
        database: process.env.POSTGRESQL_DATABASE,
        entities: [
            Employee,
            Department,
            EmployeeDepartment,
            Skill,
            EmployeeSkill,
            Project,
            EmployeeProject
        ],
        synchronize: true,
        logging: true,
    })

    AppDataSource.initialize()
        .then(() => {
            console.log('Data Source has been initialized!')
        })
        .catch((err) => {
            console.error('Error during Data Source initialization', err)
        })

    // Generate departments
    const departments: Department[] = [];
    for (let i = 0; i < numberOfDepartments; i++) {
        const department = new Department();
        department.name = faker.commerce.department();
        department.description = faker.lorem.paragraph();
        departments.push(department);
    }
    await AppDataSource.manager.save(departments);

    // Generate employees
    const employees: Employee[] = [];
    for (let i = 0; i < numberOfEmployees; i++) {
        const employee = new Employee();
        employee.firstName = faker.name.firstName();
        employee.lastName = faker.name.lastName();
        employee.name = `${employee.firstName} ${employee.lastName}`;
        employee.email = faker.internet.email();
        employee.phoneNumber = faker.phone.phoneNumber();
        employee.hireDate = faker.date.past();
        employee.jobTitle = faker.name.jobTitle();
        employee.picture = faker.image.avatar();
        employee.biography = faker.lorem.paragraph();
        employees.push(employee);
    }
    await AppDataSource.manager.save(employees);

    // Generate projects
    const projects: Project[] = [];
    for (let i = 0; i < numberOfProjects; i++) {
        const project = new Project();
        project.name = faker.commerce.productName();
        project.description = faker.lorem.paragraph();
        projects.push(project);
    }
    await AppDataSource.manager.save(projects);

    // Generate skills
    const skills: Skill[] = [];
    for (let i = 0; i < numberOfSkills; i++) {
        const skill = new Skill();
        skill.name = faker.hacker.verb();
        skills.push(skill);
    }
    await AppDataSource.manager.save(skills);

    // Assign departments to employees
    for (const employee of employees) {
        const numDepartments = faker.random.number({ min: 1, max: 3 });
        const selectedDepartments = faker.random.arrayElements(departments, numDepartments);
        for (const department of selectedDepartments) {
            const employeeDepartment = new EmployeeDepartment();
            employeeDepartment.employee = employee;
            employeeDepartment.department = department;
            employeeDepartment.role = faker.name.jobDescriptor();
            await AppDataSource.manager.save(employeeDepartment);
        }
    }

    // Assign projects to employees
    for (const employee of employees) {
        const numProjects = faker.random.number({ min: 1, max: 5 });
        const selectedProjects = faker.random.arrayElements(projects, numProjects);
        for (const project of selectedProjects) {
            const employeeProject = new EmployeeProject();
            employeeProject.employee = employee;
            employeeProject.project = project;
            employeeProject.role = faker.name.jobDescriptor();
            await AppDataSource.manager.save(employeeProject);
        }
    }

    // Assign skills to employees
    for (const employee of employees) {
        const numSkills = faker.random.number({ min: 2, max: 7 });
        const selectedSkills = faker.random.arrayElements(skills, numSkills);
        for (const skill of selectedSkills) {
            const employeeSkill = new EmployeeSkill();
            employeeSkill.employee = employee;
            employeeSkill.skill = skill;
            await AppDataSource.manager.save(employeeSkill);
        }
    }

    await AppDataSource.close();
}

generateData()
    .then(() => console.log('Data generation completed'))
    .catch((error) => console.error('Error generating data:', error));
