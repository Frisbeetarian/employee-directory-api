import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Department } from './Department';
import { Employee } from './Employee';

@Entity('employee_department')
export class EmployeeDepartment {
    @PrimaryGeneratedColumn('uuid')
    uuid!: string

    @ManyToOne(() => Employee, employee => employee.employeeDepartments)
    employee: Employee;

    @ManyToOne(() => Department, department => department.employeeDepartments)
    department: Department;

    @Column()
    role!: string;

    @UpdateDateColumn()
    updatedAt: Date

    @CreateDateColumn()
    createdAt: Date
}
