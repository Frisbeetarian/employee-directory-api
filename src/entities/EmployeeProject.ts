import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Employee} from "./Employee";
import {Project} from "./Project";

@Entity()
export class EmployeeProject {
    @PrimaryGeneratedColumn('uuid')
    uuid!: string;

    @ManyToOne(() => Employee, employee => employee.employeeProjects)
    employee: Employee;

    @ManyToOne(() => Project, project => project.employeeProjects)
    project: Project;

    @Column()
    role!: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
