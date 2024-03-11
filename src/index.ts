import dotenv from 'dotenv';
import express from 'express';
import { DataSource } from 'typeorm';
import helmet from 'helmet';
import cors from 'cors'

import { Employee } from './entities/Employee';
import { Department } from './entities/Department';
import { EmployeeDepartment } from './entities/EmployeeDepartment';
import { Skill } from './entities/Skill';
import { EmployeeSkill } from './entities/EmployeeSkill';
import { Project } from './entities/Project';
import { EmployeeProject } from './entities/EmployeeProject';
import { employeeRouter } from './routes/employeeRoutes';
import { departmentRouter } from './routes/departmentRoutes';
import { projectRouter } from './routes/projectRoutes';
import { skillRouter } from './routes/skillRoutes';
import { Location } from './entities/Location';
import { EmployeeLocation } from './entities/EmployeeLocation';
import { locationRouter } from './routes/locationRoutes';
import EmployeeService from './services/EmployeeService';
import EmployeeController from './controllers/EmployeeController';
import DepartmentService from './services/DepartmentService';
import ProjectService from './services/ProjectService';
import SkillService from './services/SkillService';
import LocationService from './services/LocationService';
import DepartmentController from './controllers/DepartmentController';
import ProjectController from './controllers/ProjectController';
import SkillController from './controllers/SkillController';
import LocationController from './controllers/LocationController';
import { searchRouter } from './routes/searchRoutes';
import SearchService from './services/SearchService';
import SearchController from './controllers/SearchController';

dotenv.config();

const app = express();
const port = process.env.PORT || 4020;

// Middleware
app.use(express.json());
app.use(helmet());

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
)

// Database connection
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
        EmployeeProject,
        Location,
        EmployeeLocation,
    ],
    synchronize: true,
    logging: true,
})

AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!')

        const employeeRepository = AppDataSource.getRepository(Employee);
        const employeeService = new EmployeeService(employeeRepository);
        const employeeController = new EmployeeController(employeeService);
        app.use('/api/employees', employeeRouter(employeeController))

        const departmentRepository = AppDataSource.getRepository(Department);
        const departmentService = new DepartmentService(departmentRepository);
        const departmentController = new DepartmentController(departmentService);
        app.use('/api/departments', departmentRouter(departmentController))

        const projectRepository = AppDataSource.getRepository(Project);
        const projectService = new ProjectService(projectRepository);
        const projectController = new ProjectController(projectService);
        app.use('/api/projects', projectRouter(projectController))

        const skillRepository = AppDataSource.getRepository(Skill);
        const skillService = new SkillService(skillRepository);
        const skillController = new SkillController(skillService);
        app.use('/api/skills', skillRouter(skillController))

        const locationRepository = AppDataSource.getRepository(Location);
        const locationService = new LocationService(locationRepository);
        const locationController = new LocationController(locationService);
        app.use('/api/locations', locationRouter(locationController));

        const searchService = new SearchService();
        const searchController = new SearchController(searchService);
        app.use('/api/search', searchRouter(searchController));

        app.use((err: Error, _: express.Request, res: express.Response, __: express.NextFunction) => {
            console.error(err.stack);
            res.status(500).json({ error: 'Internal Server Error' });
        });

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error('Error during Data Source initialization', err)
    })

