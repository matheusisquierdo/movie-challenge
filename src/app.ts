import fastity from "fastify"
import "reflect-metadata";
import { initDbStore } from "./persistence/initialize";
import { MovieService } from "./services/movie.service";

import { loaderData } from "./persistence/loader-data";
import { ProducerService } from "./services/producer.service";
import { ProducersMinMaxWinnerReponseDto } from "./dto/producer-max-min-winner-reponse.dto";


export const buildServer = async () => {

    
    const [datasource, err] = await initDbStore();

    if(err) {
        console.error(`Error initializing db: ${err}`)
        return
    }

    const movieService = new MovieService();
    const producerService = new ProducerService();

    await loaderData(movieService, producerService);

   

    const app = fastity()
 
    app.get("/",  async () : Promise<ProducersMinMaxWinnerReponseDto> => {
        return producerService.getMaxMinWinners();
    })

    app.get("/producers",  async () : Promise<any[]> => {
        const listWinners = await producerService.getAllWithMoreOne();

        if(!listWinners || listWinners.length === 0) {
            return [];
        }

        const reponseObj = listWinners.map((producer) => {
            return {previousWin : producer.minYear, followingWin: producer.maxYear, producer: producer.producer, interval: producer.maxYear - producer.minYear};
         });

         return reponseObj;
    })

    app.get("/producers-winners",  async () : Promise<any[] | undefined> => {
        const listWinners = await producerService.getWinners();

         return listWinners;
    })


    await app.listen({port: 3333})
    
    console.log("Server is running on port 3333")
    

    return app;
};





