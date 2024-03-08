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
import departmentRouter from './routes/departmentRoutes';
import projectRouter from './routes/projectRoutes';
import skillRouter from './routes/skillRoutes';
import { Location } from './entities/Location';
import { EmployeeLocation } from './entities/EmployeeLocation';
import locationRouter from './routes/locationRoutes';
import EmployeeService from './services/EmployeeService';
import EmployeeController from './controllers/EmployeeController';

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
        
        // app.use('/api/departments', departmentRouter)
        // app.use('/api/projects', projectRouter)
        // app.use('/api/skills', skillRouter)
        // app.use('/api/locations', locationRouter)

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

