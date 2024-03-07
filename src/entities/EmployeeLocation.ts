import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Employee } from './Employee';
import { Location } from './Location';

@Entity()
export class EmployeeLocation {
    @PrimaryGeneratedColumn('uuid')
    uuid!: string;

    @ManyToOne(() => Employee, employee => employee.employeeLocations)
    employee!: Employee;

    @ManyToOne(() => Location, location => location.employeeLocations)
    location!: Location;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
