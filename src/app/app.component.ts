import { Component, OnInit } from '@angular/core';
import {WeatherService} from "./app.service";
import {Configuration} from "./app.constants";
import {WeatherModel} from "./app.model";
import {Observable} from "rxjs/Rx";
import {Location} from "./location.interface";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [WeatherService, Configuration],
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{

  public weather: WeatherModel[] = [];
  public currentWeather: WeatherModel;
  public today: any = [];
  public otherDays: any = [];
  public location: string;
  public hasError: boolean;

  constructor(private _weatherService: WeatherService){}

  ngOnInit(){

    this.hasError = false;
    this.getUserLocation();
    //this.loadLocations();
    //this.forecastByCityName('lucknow');
    //this.forecastByCityId(524901);
    //this.forecastByCoords(35,139 );
  }

  loadWeatherData(query){
    this.forecastByCityName(query);
  }
  getUserLocation(){
    this._weatherService.getLocation()
        .subscribe(data => {
          this.location = data.city+","+data.country;
          this.forecastByCityName(this.location);
        })
  }


  formatWeather(data){
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var weekdayName = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    this.weather = [];
    this.location = data.city.name+","+data.city.country;

    var dateToday = new Date();

    for(var i=0;i<data.list.length;i++){

      var list = data.list[i],
          main = list['main'],
          weather = list['weather'][0],
          wind = list['wind'],
          date = new Date(list['dt_txt'].replace(' ', 'T')),
          dayName = weekdayName[date.getDay()],
          shortDayName = dayName.substr(0,3);
      //console.log("date: "+date);
      //console.log("date getday: "+date.getDay());
      //console.log("dayname: "+dayName);

      var obj = {
        "main":   {
          "temp": main.temp,
          "temp_min": main.temp_min,
          "temp_max": main.temp_max,
          "humidity": main.humidity,
        },
        "weather": {
          "icon": "http://openweathermap.org/img/w/"+weather['icon']+".png",
          "description":  weather['description'],
        },
        "date": dayName+", "+ monthNames[date.getMonth()]+" "+date.getDate(),
        "wind": {
          "speed": wind['speed'],
          "degree": wind['degree']
        }
      };

      var daySlice = 'noon';

      if(date.getHours() == 6) {
        daySlice = 'morning';
      }
      else if(date.getHours() == 12){
        daySlice = 'noon';
      }
      else if(date.getHours() == 18){
        daySlice = 'evening';
      }
      else if(date.getHours() == 21){
        daySlice = 'night';
      }

      if(dateToday.getDate() == date.getDate()){
        this.today[daySlice] = new WeatherModel(obj);
      }else{
        if(!this.otherDays.hasOwnProperty(shortDayName)){
            this.otherDays[shortDayName] = [];
        }else{
            this.otherDays[shortDayName][daySlice] = new WeatherModel(obj);
        }
      }

      this.weather.push(
        new WeatherModel(obj)
      );
    }

    this.currentWeather = this.today['noon'];

    console.log("weather today: ");
    console.log(this.today);

    console.log("weather other days: ");
    console.log(this.otherDays);

  }

  //Get location data from local file
  //loadLocations(){
  //  this._weatherService.getLocations()
  //      .subscribe(data => {
  //        this.locations = data;
  //        console.log(this.locations);
  //      })
  //}

  forecastByCityName(city) {
    this._weatherService.makeUrl('q=' + city);
    this._weatherService.getForecast()
      .subscribe(data => {
        this.formatWeather(data);
        this.hasError = false;
      },
      error => {
        this.hasError = true;
        this.currentWeather = null;
        this.weather = [];
      });
  }

  forecastByCityId(id){
    this._weatherService.makeUrl('id='+parseInt(id));
    this._weatherService.getForecast()
      .subscribe(data => {
        console.log(data);
      });

  }

  forecastByCoords(lat,lon){
    this._weatherService.makeUrl('lat='+lat+'&lon='+lon);
    this._weatherService.getForecast()
      .subscribe(data => {
        console.log(data);
      });

  }
}
