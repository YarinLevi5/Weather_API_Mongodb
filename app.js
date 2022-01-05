let http = require('http');
let weatherKey = process.env.weatherKey;
// console.log(weatherKey);

function getData(cb) {

    http.get(`http://api.openweathermap.org/data/2.5/weather?q=israel&appid=${weatherKey}`, res => {
        let data = ""
        res.on('data', string => {
            data += string
        })
        res.on('end', () => {
            let obj = JSON.parse(data);
            cb(obj);
        })

    }).on("error", error => {
        cb(error);
    })
}

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/";

function connectToMongo(data) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("weather-db");
        dbo.collection("node").insertOne(data, err => {
            if (err) throw err;
            console.log(data);
            console.log("documents inserted");
            db.close();
        });
    });
}
getData(connectToMongo);