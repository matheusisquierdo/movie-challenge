export class ProducerIntervalReponseDto {
    producer: string;
    interval: number;
    previousWin: number;
    followingWin: number;
    
}

export class ProducersMinMaxWinnerReponseDto {
    max: ProducerIntervalReponseDto[];
    min: ProducerIntervalReponseDto[];
}