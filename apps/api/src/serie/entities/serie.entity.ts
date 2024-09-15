import { Column, Entity, PrimaryGeneratedColumn} from "typeorm"

@Entity()
export class Serie {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    serie: string
}