import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

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
}
