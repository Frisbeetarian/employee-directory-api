import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EmployeeSkill } from './EmployeeSkill';

@Entity()
export class Skill {
    @PrimaryGeneratedColumn('uuid')
    uuid!: string;

    @Column()
    name!: string;

    @OneToMany(() => EmployeeSkill, employeeSkill => employeeSkill.skill)
    employeeSkills: EmployeeSkill[];

    @UpdateDateColumn()
    updatedAt: Date

    @CreateDateColumn()
    createdAt: Date
}
