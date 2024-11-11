import { AppDataStore } from "../persistence/initialize";
import { MovieEntity } from "../entities/movie.entity";
import { DataSource, Repository } from "typeorm";
import { ProducerEntity } from "../entities/producer.entity";
import { ProducerEntryDto } from "../dto/producer-entry.dto";
import { ProducerIntervalReponseDto, ProducersMinMaxWinnerReponseDto } from "../dto/producer-max-min-winner-reponse.dto";

export class ProducerService {

    private producerRepo : Repository<ProducerEntity>;
    
    constructor() {
        if(!AppDataStore) {
            throw new Error("Datastore not initialized");
        }
        this.producerRepo = AppDataStore.getRepository(ProducerEntity);
    }

    
    async findByName(producerEntryDto : ProducerEntryDto): Promise<ProducerEntity> {
        const { producer, yearWinner,title } = producerEntryDto;
        const producerEntity = await  this.producerRepo.
        createQueryBuilder("producer")
        .where("producer.producer = :producer", { producer }).getOne();
        

        if(!producerEntity ) {
            return { producer, minYear: yearWinner, maxYear: yearWinner, titleMinYear: title, titleMaxYear: title };   
        }

        return producerEntity;
     }

    async getAllMovies(): Promise<ProducerEntity[] | undefined> {
       return this.producerRepo.find();
    }

    async getAllWithMoreOne(): Promise<ProducerEntity[] | undefined> {
        return this.producerRepo.createQueryBuilder("producer")
        .where("producer.titleMinYear != producer.titleMaxYear")   
        .getMany();
     }

     async getWinners(): Promise<ProducerEntity[] | undefined> {
        return this.producerRepo.createQueryBuilder("producer")
        //.where("producer.titleMinYear != producer.titleMaxYear")   
        .getMany();
     }

     async getMaxMinWinners(): Promise<ProducersMinMaxWinnerReponseDto> {

        const listWinners= await this.getAllWithMoreOne();

        if(!listWinners || listWinners.length === 0) {
            return {
                max: [],
                min: [],
            };
        }

        const listWinnersWithIntervals = listWinners.map( winner => {
            let minInterval: number=  Number.MAX_VALUE;
            let minPreviousWin = 0;
            let minFollowingWin = 0;

            let maxInterval : number = 0;
            let maxPreviousWin = 0;
            let maxFollowingWin = 0;

            let previous = 0;
            winner.winners.forEach((currentValue) => {

                if(previous != 0) {
                    if(currentValue - previous > maxInterval) {
                        maxInterval = currentValue - previous;
                        minFollowingWin = currentValue;
                        minPreviousWin = previous;
                    }
                    if(currentValue - previous < minInterval) {
                        minInterval = currentValue - previous;
                        maxFollowingWin = currentValue;
                        maxPreviousWin = previous;
                    }
                }
                previous = currentValue;
                
            });

            return { ... winner, minInterval, maxInterval, minFollowingWin, minPreviousWin, maxFollowingWin, maxPreviousWin};
        })

        //  const reponseObj = listWinners.map((producer) => {
        //     return {previousWin : producer.minYear, followingWin: producer.maxYear, producer: producer.producer, minInterval: producer.maxYear - producer.minYear};
        //  });


         const minWinners = listWinnersWithIntervals.reduce(
            (accumulator, currentValue ) => {
              return (accumulator.minInterval < currentValue.minInterval ? accumulator : currentValue);
            }
          );

        const maxWinners = listWinnersWithIntervals.reduce(
            (accumulator, currentValue) => {
            return (accumulator.maxInterval > currentValue.maxInterval ? accumulator : currentValue);
            }
        );

        return {
            min: [...listWinnersWithIntervals.filter((producer) => producer.minInterval === minWinners.minInterval)
                .map(winner => {
                    const {minInterval, minFollowingWin, minPreviousWin, producer} = winner;
                    return {producer, interval: minInterval, previousWin: minPreviousWin, followingWin: minFollowingWin};
                })
                
            ],
            max: [...listWinnersWithIntervals.filter((producer) => producer.maxInterval === maxWinners.maxInterval)
                .map(winner => {
                const {maxFollowingWin, maxPreviousWin,maxInterval, producer} = winner;
                return {producer, interval: maxInterval, previousWin: maxPreviousWin, followingWin: maxFollowingWin};
            })],            
        }



     }

    async create(producer :ProducerEntity): Promise<ProducerEntity> {
      
        return await this.producerRepo.save(producer);
      

     }
}