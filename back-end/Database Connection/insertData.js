// https://www.w3schools.com/nodejs/nodejs_mysql.asp
// This is the link that talks about connecting javascript and MySQL


const express = require('express');
const mysql = require('mysql');
const app = express ();
var bodyParser = require('body-parser');


//creating mySql connection
const connection = mysql.createConnection({
	host:'localhost',
	port:3306,
	database: 'registration',
	user:'root',
	password:'password'
});


connection.connect(function(error){
	if(error)
	{
		console.log('Connection Unsuccessful.');
	}
	else{
		console.log('Connection Successful.');
	}
});

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {

	res.sendFile('registerForm.html', {root: __dirname})

});

app.post('/submit', function(req, res) {
	var name=req.body.name;
	var password=req.body.password;
  	var email=req.body.email;
	
	var sql = "INSERT INTO newusers (name, password, email) VALUES ('"+name+"', '"+password+"','"+email+"')";

	res.write('Data has been successully entered.');

	connection.query(sql, function (error, result) {
        	if (error) throw errow
	});
	res.end();
	connection.end();
});


app.listen(3000);
