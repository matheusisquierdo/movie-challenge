import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('movie')
export class MovieEntity {

    @PrimaryGeneratedColumn({type: 'int'})
    id: number;

    @Column({type: 'int'})
    year: number;

    @Column({type: 'varchar', length: 100})
    title: string;

    @Column({type: 'varchar', length: 100})
    studios: string;

    @Column('simple-array', { nullable: true, array: true })
    //@Column('text', { array: true })
    producers: string[];

    @Column('boolean')
    winner: boolean;


}