import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EmployeeProject } from './EmployeeProject';

@Entity()
export class Project {
    @PrimaryGeneratedColumn('uuid')
    uuid!: string;

    @Column()
    name!: string;

    @Column('text', { nullable: true })
    description?: string;

    @OneToMany(() => EmployeeProject, employeeProject => employeeProject.project)
    employeeProjects: EmployeeProject[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
