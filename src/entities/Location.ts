import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EmployeeLocation } from './EmployeeLocation';

@Entity()
export class Location {
    @PrimaryGeneratedColumn('uuid')
    uuid!: string;

    @Column()
    name!: string;

    @Column()
    address!: string;

    @Column()
    city!: string;

    @Column()
    state!: string;

    @Column()
    country!: string;

    @Column()
    zipCode!: string;

    @OneToMany(() => EmployeeLocation, employeeLocation => employeeLocation.location)
    employeeLocations?: EmployeeLocation[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
