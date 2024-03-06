import {CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Employee} from "./Employee";
import {Department} from "./Department";

@Entity()
export class EmployeeDepartment {
    @PrimaryGeneratedColumn('uuid')
    uuid!: string

    @ManyToOne(() => Employee, employee => employee.employeeDepartments)
    employee: Employee;

    @ManyToOne(() => Department, department => department.employeeDepartments)
    department: Department;

    @UpdateDateColumn()
    updatedAt: Date

    @CreateDateColumn()
    createdAt: Date
}
