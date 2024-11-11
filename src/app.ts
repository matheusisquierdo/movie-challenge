import fastity from "fastify"
import "reflect-metadata";
import { initDbStore } from "./persistence/initialize";
import { MovieService } from "./services/movie.service";

import { loaderData } from "./persistence/loader-data";
import { ProducerService } from "./services/producer.service";
import { ProducersMinMaxWinnerReponseDto } from "./dto/producer-max-min-winner-reponse.dto";
import { MovieEntity } from "./entities/movie.entity";


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
 
    app.get("/winners/summaries",  async () : Promise<ProducersMinMaxWinnerReponseDto> => {
        return producerService.getMaxMinWinners();
    })

    app.get("/movies",  async () : Promise<MovieEntity[]> => {
        return movieService.getAllMovies();         
    });

    app.get("/winners",  async () : Promise<any[]> => {
        const listWinners = await producerService.getAll();
         return listWinners;
    });

    await app.listen({port: 3333})
    
    console.log("Server is running on port 3333")
    

    return app;
};





