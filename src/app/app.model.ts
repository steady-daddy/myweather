export class WeatherModel{

    main: any;
    weather: any;
    day:  string;
    date: string;
    wind:  any;

    constructor(weather:any){
        this.main     = weather.main;
        this.weather  = weather.weather;
        this.date     = weather.date;
        this.day      = weather.day;
        this.wind     = weather.wind;
    }
}
