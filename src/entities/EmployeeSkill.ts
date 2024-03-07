import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Employee } from './Employee';
import { Skill } from './Skill';

@Entity('employee_skill')
export class EmployeeSkill {
    @PrimaryGeneratedColumn('uuid')
    uuid!: string;

    @ManyToOne(() => Employee, employee => employee.employeeSkills)
    employee!: Employee;

    @ManyToOne(() => Skill, skill => skill.employeeSkills)
    skill!: Skill;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
