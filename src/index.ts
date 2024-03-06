import express from 'express';
import { createConnection } from 'typeorm';
import { Employee } from './entities/Employee';
import helmet from 'helmet';

const app = express();
const port = process.env.PORT || 4020;

// Middleware
app.use(helmet());

// Database connection
createConnection({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Employee],
    synchronize: true,
    logging: false,
})
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((error) => {
        console.error('Database connection error:', error);
        process.exit(1);
    });


app.use((err: Error, _: express.Request, res: express.Response, __: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
