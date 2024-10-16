import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'google_user' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column({ nullable: true })
    picture: string;
}