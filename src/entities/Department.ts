import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";

import {Employee} from "./Employee";

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

    @OneToMany(() => Employee, employee => employee.department)
    employees?: Employee[];
}
