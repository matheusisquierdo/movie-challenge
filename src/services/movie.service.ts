import { AppDataStore } from "../persistence/initialize";
import { MovieEntity } from "../entities/movie.entity";
import { DataSource, Repository } from "typeorm";

export class MovieService {

    private movieRepository : Repository<MovieEntity>;
    
    constructor() {
        if(!AppDataStore) {
            throw new Error("Datastore not initialized");
        }
        this.movieRepository = AppDataStore.getRepository(MovieEntity);
    }

    


    async getAllMovies(): Promise<MovieEntity[]> {
       return this.movieRepository.find();
    }

    async createMovie(movie : MovieEntity): Promise<MovieEntity> {
        const gameResult = await this.movieRepository.save(movie )
        return movie;
     }
}