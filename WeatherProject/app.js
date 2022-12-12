//const { response } = require("express");
const express = require("express");
const app = express();
const https = require('node:https');
const bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({extended: true})); //for parsing the body of the post from index.html

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html"); //bring up index.html
});

app.listen(process.env.PORT || 3000, function(){
    console.log("listening on port 3000");
});

app.post("/", function(req, res){

    var weatherIconUrl = "http://openweathermap.org/img/wn/";
    const weatherIconEnding = "@2x.png";
    var lat =  req.body.latInput; //44.0521; eugene coordinates
    var lon =  req.body.longInput; //-123.0868;
    const apId = "3fca1fa71a5d8b532ea7eaf4f532a7a3"
    var latLongQuery = `lat=${lat}&lon=${lon}`;
    const url = "https://api.openweathermap.org/data/2.5/weather?" + latLongQuery + "&appid=" + apId + "&units=imperial";

    https.get(url, function (response) {
        response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            console.log(weatherData)
            if (weatherData.main){
            //JSON.stringify(weatherData) basically does the opposite
            //console.log(weatherData);
            const temp = weatherData.main.temp;
            var city = weatherData.name;
            console.log("city: " + city);
            if (city === ""){
                city = "Unnamed Location"
            }
            const weatherDescription = weatherData.weather[0].description;
            const weatherIcon = weatherData.weather[0].icon;
            console.log(weatherIcon);
            weatherIconUrl += weatherIcon + weatherIconEnding;
            //console.log(`The temp is ${temp} degrees F in ${city}. Weather description: ${weatherDescription}.`);
            res.write(`<h1>The temp is ${temp} degrees F in ${city}. </h1>`);
            res.write(`<img src="${weatherIconUrl}">`);
            res.write(`<p> Weather description: ${weatherDescription}.</p>`);
            res.write("<a href='https://joeyweather.herokuapp.com/'>home</a>")
            res.send();
            } else {
                res.write("<h1>Error in getting weather</h1>");
                res.write("<p>Make sure latitude and longitude are valid values</p>")
                res.write("<a href='https://joeyweather.herokuapp.com/'>home</a>")
                res.send();
            }
        });
    });
});

app.get("/favicon.ico", function (req, res){
    res.send(null);
})