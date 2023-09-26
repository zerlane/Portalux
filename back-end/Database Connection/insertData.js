//download Xampp -> start Apache and MySql -> go to localhost/phpmyadmin-> create database 'registration' 
//-> create table 'newusers' under this database and create fields 

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
		console.log('Cannot connect to database.');
	}
	else{
		console.log('Connection to database successful.');
	}
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {

	res.sendFile('registerForm.html', {root: __dirname})

});

app.post('/submit', function(req, res) {
	var name=req.body.name;
	var password=req.body.password;
  	var email=req.body.email;
	
	res.write('Data has been successully entered.');
	
	var sql = "INSERT INTO newusers (name, password, email) VALUES ('"+name+"', '"+password+"','"+email+"')";

	connection.query(sql, function (err, result) {
        	if (err) throw err
	});
	res.end();
	connection.end();
});


app.listen(3000);
