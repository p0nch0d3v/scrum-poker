import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Serie {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    serie: string

    @Column()
    values: string

    @Column({ default: true })
    isFull: boolean

    @Column({ default: false })
    isWildcard: boolean
}