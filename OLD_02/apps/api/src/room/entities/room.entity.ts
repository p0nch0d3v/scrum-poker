import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Room {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    admin: string;

    @Column({ nullable: true })
    password: string;

    /**
    * @deprecated This would be replaced by "serie" and "values"
    */
    @Column({ nullable: true })
    cards: string;

    @Column({ nullable: true })
    serie: string;

    @Column({ nullable: true })
    values: string;

    @CreateDateColumn()
    created_at: Date;
}
