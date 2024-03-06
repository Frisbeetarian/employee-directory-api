import {
    Column,
    CreateDateColumn,
    Entity, JoinTable, ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Department} from "./Department";
import {EmployeeDepartment} from "./EmployeeDepartment";
import {Skill} from "./Skill";
import {EmployeeSkill} from "./EmployeeSkill";
import {EmployeeProject} from "./EmployeeProject";

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

    @Column({nullable: true})
    picture?: string;

    @Column({ nullable: true })
    biography?: string;

    @OneToMany(() => EmployeeDepartment, employeeDepartment => employeeDepartment.employee)
    employeeDepartments: EmployeeDepartment[];

    @OneToMany(() => EmployeeSkill, employeeSkill => employeeSkill.employee)
    employeeSkills: EmployeeSkill[];

    @OneToMany(() => EmployeeProject, employeeProject => employeeProject.employee)
    employeeProjects: EmployeeProject[];

    @UpdateDateColumn()
    updatedAt: Date

    @CreateDateColumn()
    createdAt: Date
}
