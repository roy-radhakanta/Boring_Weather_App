var apiMode = (function () {
    let latLong = async function getLatLong(lat, long) {
        try {
            const forLatLong = await fetch(`https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/search/?lattlong=${lat},${long}`);
            const latilong = await forLatLong.json();
            return latilong;
        }
        catch (error) {
            console.log(error);
        }
    }

    let whereOnEar = async function getWeatherAw(woeid) {
        try {
            const weatherD = await fetch(`https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/${woeid}/`);
            const result = await weatherD.json();
            return result;
        }
        catch (error) {
            console.log(error);
        }
    }

    return{
        latLongPass: function(){
            return latLong;
        },
        earthAdd: function(){
            return whereOnEar;
        }
    };
})();

var showWeatherUi = (function(){

    let allSelector = {
        location: document.getElementById('location'),
         todayTime: document.getElementById('nowTime'),
         todayDate: document.getElementById('todayDate'),
        temperature: document.getElementById('temperatureWeather'),
        predictability: document.getElementById('prediction'),
        windSpeed: document.getElementById('windSpeed')
    };
    
    return {
        todayWeatherSelector: function(){
            return allSelector;
        }
    };
})();

var controllerApp = (function(appDa, weatherUi) {
    let latlong = navigator.geolocation.getCurrentPosition(see);
    let uiToday;
    uiToday = weatherUi.todayWeatherSelector();
    // console.log(uiToday);
    let showWeatherData = function(weatherInfo){
        // console.log(weatherInfo.consolidated_weather);
        uiToday.location.textContent = weatherInfo.title;
        let currentdate = new Date();
        uiToday.todayTime.textContent = currentdate.getHours() + ":" 
+ currentdate.getMinutes();
        uiToday.todayDate.textContent = weatherInfo.consolidated_weather[0].applicable_date;
        uiToday.temperature.textContent = Math.round(weatherInfo.consolidated_weather[0].the_temp) + "c";
        uiToday.predictability.textContent = Math.round(weatherInfo.consolidated_weather[0].predictability) + "%";
        uiToday.windSpeed.textContent = Math.round(weatherInfo.consolidated_weather[0].wind_speed) + "kph";
    }

    function see(pod) {
        let dataWe;
        let captureFunc = appDa.latLongPass();
        captureFunc(pod.coords.latitude, pod.coords.longitude).then(data => {
            dataWe = data;
            getCoordGvRes(dataWe[0].woeid);
        });
    }
    var getCoordGvRes = function (woeid) {
        let dataRes;
        let getWeather = appDa.earthAdd();
        getWeather(woeid).then(weather => {
            dataRes = weather;
            console.log(dataRes);
            showWeatherData(dataRes);
        });
    }


    return {
        initWeather: function(){
            return latlong;
        }
    };

})(apiMode, showWeatherUi);

controllerApp.initWeather();

