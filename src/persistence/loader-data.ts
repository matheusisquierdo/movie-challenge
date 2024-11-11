import csv from 'csvtojson';
import { join } from 'path';
import { json } from 'stream/consumers';
import { MovieService } from '../services/movie.service';
import { ProducerService } from '../services/producer.service';
import { ProducerEntryDto } from '../dto/producer-entry.dto';
import { ProducerEntity } from '../entities/producer.entity';

const csvFilePath = join( __dirname,'../','data/movies.csv');
export const loaderData = async (movieSrv: MovieService, producerSrv : ProducerService) => {
    const jsonArray=await csv({ delimiter: ';',
        colParser:{
            "producers":function(item, head, resultRow, row , colIdx){
                return item.split(/, | and /);
            }
        }
    }).fromFile(csvFilePath);

    const array = {};

    Promise.all(jsonArray.sort((a, b) => a.year-b.year).map(async (element: any) => {
        if(element.winner == "yes") {
            element.producers.map((strProducer: string) => { 

                if(array[strProducer] )
                    { 
                        const producer = array[strProducer];

                        if(producer) {
                            if(producer.maxYear < element.year) {
                                producer.maxYear = element.year;
                                producer.titleMaxYear = element.title;
                            }
                            else if(producer.minYear > element.year) {
                                producer.minYear = element.year;
                                producer.titleMinYear = element.title;
                            }
                            producer.winners.push(element.year);
                        }

                    }
                    else{
                        const producerEntry = new ProducerEntity();
                        producerEntry.producer = strProducer;
                        producerEntry.minYear = element.year;
                        producerEntry.maxYear = element.year;
                        producerEntry.titleMinYear = element.title;
                        producerEntry.titleMaxYear = element.title;
                        producerEntry.winners = [element.year];
                        array[strProducer] = producerEntry;
                    }
               
            });
        }
       return  movieSrv.createMovie(element);
    }));

    Object.values(array).map(async (value) => {
        await producerSrv.create(value);
    });

    console.log(jsonArray);
}

const splitByCommaSpaceOrWordAnd = (input: string) => {
    return input.split(/, | and /);
};

// Example usage
const exampleString = "producer1, producer2 and producer3";
console.log(splitByCommaSpaceOrWordAnd(exampleString)); // ["producer1", "producer2", "producer3"]