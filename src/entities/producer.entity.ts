import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('producer')
export class ProducerEntity {

    @PrimaryColumn({type: 'varchar', length: 100})
    producer: string;

    @Column({type: 'int'})
    minYear: number;
    
    @Column({type: 'int'})
    maxYear: number;

    @Column({type: 'varchar', length: 100})
    
    titleMinYear: string;

    @Column({type: 'varchar', length: 100})
    titleMaxYear: string;

    @Column('simple-array', { nullable: true, array: true })
    winners: number[];

    
}