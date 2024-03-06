import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Employee} from "./Employee";

@Entity()
export class Skill {
    @PrimaryGeneratedColumn('uuid')
    uuid!: string;

    @Column()
    name!: string;
}
