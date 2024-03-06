import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { DataSource } from 'typeorm';
import { Employee } from './entities/Employee';
import helmet from 'helmet';

const app = express();
const port = process.env.PORT || 4020;

// Middleware
app.use(helmet());

console.log("process.env.DB_USERNAME", process.env.POSTGRESQL_USERNAME)

// Database connection
const AppDataSource = new DataSource({
    type: 'postgres',
    host: "localhost",
    port: Number(process.env.POSTGRESQL_PORT),
    username: process.env.POSTGRESQL_USERNAME,
    password: process.env.POSTGRESQL_PASSWORD,
    database: process.env.POSTGRESQL_DATABASE,
    entities: [Employee],
    synchronize: true,
    logging: false,
})

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })

app.use((err: Error, _: express.Request, res: express.Response, __: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
