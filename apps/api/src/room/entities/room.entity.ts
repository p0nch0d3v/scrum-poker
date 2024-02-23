import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Room {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({nullable: true})
    password: string;
}
