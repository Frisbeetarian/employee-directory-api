import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

import { Employee } from './Employee';
import { EmployeeDepartment } from './EmployeeDepartment';

@Entity()
export class Department {
    @PrimaryGeneratedColumn('uuid')
    uuid!: string

    @Column()
    name!: string;

    @Column()
    description!: string;

    @ManyToOne(() => Employee)
    manager!: Employee;

    @OneToMany(() => EmployeeDepartment, employeeDepartment => employeeDepartment.department)
    employeeDepartments: EmployeeDepartment[];

    @UpdateDateColumn()
    updatedAt: Date

    @CreateDateColumn()
    createdAt: Date
}
