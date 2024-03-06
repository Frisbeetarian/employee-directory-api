import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Department} from "./Department";
import {EmployeeDepartment} from "./EmployeeDepartment";

@Entity()
export class Employee {
    @PrimaryGeneratedColumn('uuid')
    uuid!: string

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column()
    name!: string;

    @Column()
    email!: string;

    @Column()
    phoneNumber?: string;

    @Column()
    hireDate?: Date;

    @Column()
    jobTitle?: string;

    @Column()
    picture?: string;

    @OneToMany(() => EmployeeDepartment, employeeDepartment => employeeDepartment.employee)
    employeeDepartments: EmployeeDepartment[];

    @UpdateDateColumn()
    updatedAt: Date

    @CreateDateColumn()
    createdAt: Date
}
