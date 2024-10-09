'use strict';

var weatherInfoObj = {};

window.addEventListener('load' , ()=> {
    //Login to read the coordinates
    var apiKey = 'a8MMKZzKTqYe7DAGMbkHAbumQ4p2dsGa';
    var lat,long;
    var country , locationKey , timeZone , currentLocation;
    navigator.geolocation.getCurrentPosition((position)=> {
        lat = position['coords']['latitude'];
        long = position['coords']['longitude'];
        console.log(lat+"  "+long);
        var geopositionUrl = `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${apiKey}&q=${lat},${long}`;
        axios.get(geopositionUrl).then((response)=> {
            weatherInfoObj['country'] = response.data.Country.EnglishName;
            weatherInfoObj['locationKey'] = response.data.Key;
            weatherInfoObj['timeZone'] = response.data.TimeZone;
            weatherInfoObj['currentLocation'] = response.data.LocalizedName;
            
            getWeatherData(apiKey,weatherInfoObj.locationKey);
            
        });
        
    });
});

function getWeatherData(apiKey,locationKey){
    var weatherUrl = `https://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}?apikey=${apiKey}`;
    axios.get(weatherUrl).then((response)=> {
        weatherInfoObj['today'] = response.data.DailyForecasts[0].Date;
        weatherInfoObj['day'] = response.data.DailyForecasts[0].Day;
        weatherInfoObj['night'] = response.data.DailyForecasts[0].Night;
        weatherInfoObj['temperature'] = response.data.DailyForecasts[0].Temperature;
        var today = new Date(weatherInfoObj['today']);
        console.log('Weather Information',weatherInfoObj);
        returnId('country').textContent = weatherInfoObj['country'];
        returnId('currentLocation').textContent = weatherInfoObj['currentLocation'];
        returnId('date').textContent = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear() + "  " + weatherInfoObj.timeZone.Code;
        if(weatherInfoObj.day.Icon < 10){
            returnId('morning').setAttribute('src',`https://developer.accuweather.com/sites/default/files/0${weatherInfoObj.day.Icon}-s.png`);
        }else{
            returnId('morning').setAttribute('src',`https://developer.accuweather.com/sites/default/files/${weatherInfoObj.day.Icon}-s.png`);
        }
        if(weatherInfoObj.night.Icon < 10){
            returnId('night').setAttribute('src',`https://developer.accuweather.com/sites/default/files/0${weatherInfoObj.night.Icon}-s.png`);
        }else{
            returnId('night').setAttribute('src',`https://developer.accuweather.com/sites/default/files/${weatherInfoObj.night.Icon}-s.png`);
        }
        
        returnId('morning-desc').textContent = weatherInfoObj.day.IconPhrase;
        returnId('night-desc').textContent = weatherInfoObj.night.IconPhrase;
        returnId('morning-max').textContent= weatherInfoObj.temperature.Maximum.Value;
        returnId('morning-min').textContent= weatherInfoObj.temperature.Minimum.Value;
        returnId('night-max').textContent= weatherInfoObj.temperature.Maximum.Value;
        returnId('night-min').textContent= weatherInfoObj.temperature.Minimum.Value;
        
    });
}

function returnId(id){
    return document.getElementById(id);
    
}