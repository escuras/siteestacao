var sensor = require('node-dht-sensor');
var configuration = require('./config/config');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var herokuapi = "https://metereologia.herokuapp.com";

function insertValue(err, temperature, humidity){
	var xhttp = new XMLHttpRequest();
	var temp = temperature.toFixed(1);
	var humidity = humidity.toFixed(1);
	xhttp.onreadystatechange = function(){
	if (this.readyState == 4) {
		switch(this.status) {
			case 201:
				console.log('The value ' + temp + ' was inserted.');
				break;
			case 401:
				console.log('The value is needed.');
				break;
			case 402:
				console.log('The account is needed.');
				break;
			default:
				console.log('Unknown error.');
				break;
			}	
		}
	}
	xhttp.open("POST", herokuapi + "/api/temperature?" +"account=" + configuration.account + "&value=" + temp);
	xhttp.send();
}

function readTemp(){
	sensor.read(22, configuration.pin, function(err, temperature, humidity) {
		if(!err) {
			insertValue(err, temperature, humidity);
		} else {
			sensor.read(22, configuration.pin, function(err, temperature, humidity) {
				insertValue(err, temperature, humidity);	
			});
		}
	});
}

function run(){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){
		if (this.readyState == 4) {
			var interval = parseInt(this.responseText);
			if(this.status == 200) {
				console.log("interval defined has: " + interval);
				setInterval(readTemp, interval);
			} else {
				var localInterval = 60000 * 20;
				console.log("Impossible get configuration, interval defined has: " + localInterval);
				setInterval(readTemp, localInterval);
			}
		}
	}
	xhttp.open("GET", herokuapi + "/api/configuration/period?" +"account=" + configuration.account);
	xhttp.send();
	
}

run();