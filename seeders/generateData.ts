import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';

import { Employee } from '../src/entities/Employee';
import { Department } from '../src/entities/Department';
import { EmployeeDepartment } from '../src/entities/EmployeeDepartment';
import { Project } from '../src/entities/Project';
import { EmployeeProject } from '../src/entities/EmployeeProject';
import { Skill } from '../src/entities/Skill';
import { EmployeeSkill } from '../src/entities/EmployeeSkill';
import { Location } from '../src/entities/Location';
import { EmployeeLocation } from '../src/entities/EmployeeLocation';
import SearchService from '../src/services/SearchService';

const numberOfEmployees = 450;
const numberOfDepartments = 8;
const numberOfProjects = 23;
const numberOfSkills = 30;
const numberOfLocations = 8;

async function generateData() {
    const AppDataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5433,
        username: 'admin',
        password: 'password',
        database: 'employeedirectory',
        entities: [
            Employee,
            Department,
            EmployeeDepartment,
            Skill,
            EmployeeSkill,
            Project,
            EmployeeProject,
            Location,
            EmployeeLocation
        ],
        synchronize: true,
        logging: true,
    });

    await AppDataSource.initialize()
        .then(() => {
            console.log('Data Source has been initialized!');
        })
        .catch((err) => {
            console.error('Error during Data Source initialization', err);
        });

    const searchService = new SearchService();

    // Roles
    const roles = [
        'Software Engineer',
        'Senior Software Engineer',
        'Team Lead',
        'Project Manager',
        'QA Engineer',
        'DevOps Engineer',
        'Product Manager',
        'UI/UX Designer',
        'Data Analyst',
        'Database Administrator',
        'Technical Writer',
        'Sales Representative'
    ];

    // Generate departments
    const departments: Department[] = [];
    for (let i = 0; i < numberOfDepartments; i++) {
        const department = new Department();
        department.name = faker.commerce.department();
        department.description = faker.lorem.paragraph();
        departments.push(department);
    }
    await AppDataSource.manager.save(departments);

    // Generate locations
    const locations: Location[] = [];
    for (let i = 0; i < numberOfLocations; i++) {
        const location = new Location();
        location.address = faker.location.streetAddress();
        location.city = faker.location.city();
        location.state = faker.location.state();
        location.country = faker.location.country();
        location.name = `${location.city} ${location.country}`
        location.zipCode = faker.location.zipCode();
        locations.push(location);
    }
    await AppDataSource.manager.save(locations);

    // Generate employees
    const employees: Employee[] = [];
    for (let i = 0; i < numberOfEmployees; i++) {
        const employee = new Employee();
        employee.firstName = faker.person.firstName();
        employee.lastName = faker.person.lastName();
        employee.name = `${employee.firstName} ${employee.lastName}`;
        employee.email = faker.internet.email();
        employee.phoneNumber = faker.phone.number();
        employee.hireDate = faker.date.past();
        employee.jobTitle = faker.helpers.arrayElement(roles);
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
        const numDepartments = faker.datatype.number({ min: 1, max: 3 });
        const selectedDepartments = faker.helpers.arrayElements(departments, numDepartments);
        for (const department of selectedDepartments) {
            const employeeDepartment = new EmployeeDepartment();
            employeeDepartment.employee = employee;
            employeeDepartment.department = department;
            employeeDepartment.role = faker.helpers.arrayElement(roles);
            await AppDataSource.manager.save(employeeDepartment);
        }
    }

    // Assign projects to employees
    for (const employee of employees) {
        const numProjects = faker.datatype.number({ min: 1, max: 5 });
        const selectedProjects = faker.helpers.arrayElements(projects, numProjects);
        for (const project of selectedProjects) {
            const employeeProject = new EmployeeProject();
            employeeProject.employee = employee;
            employeeProject.project = project;
            employeeProject.role = faker.helpers.arrayElement(roles);
            await AppDataSource.manager.save(employeeProject);
        }
    }

    // Assign skills to employees
    for (const employee of employees) {
        const numSkills = faker.datatype.number({ min: 2, max: 7 });
        const selectedSkills = faker.helpers.arrayElements(skills, numSkills);
        for (const skill of selectedSkills) {
            const employeeSkill = new EmployeeSkill();
            employeeSkill.employee = employee;
            employeeSkill.skill = skill;
            await AppDataSource.manager.save(employeeSkill);
        }
    }

    // Assign locations to employees
    for (const employee of employees) {
        const numLocations = faker.datatype.number({ min: 1, max: 3 });
        const selectedLocations = faker.helpers.arrayElements(locations, numLocations);
        for (const location of selectedLocations) {
            const employeeLocation = new EmployeeLocation();
            employeeLocation.employee = employee;
            employeeLocation.location = location;
            await AppDataSource.manager.save(employeeLocation);
        }
    }

    await searchService.indexEmployees(employees);

    await AppDataSource.destroy();
}

generateData()
    .then(() => console.log('Data generation completed'))
    .catch((error) => console.error('Error generating data:', error));
