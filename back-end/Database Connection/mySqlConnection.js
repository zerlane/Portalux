//download Xampp -> start Apache and MySql -> go to localhost/phpmyadmin-> create database 'registration' 
//-> create table 'newusers' under this database and create fields 

//deleted "Link to Node.js", added notes below -Nautishay
// https://www.w3schools.com/nodejs/nodejs_mysql.asp
// This is the link that talks aboiut connecting javascript and MySQL


const express = require('express');
const mysql = require('mysql');
const app = express ();

const connection = mysql.createConnection({
	host:'localhost',
	port:3306,
	database: 'registration',
	user:'root',
	password:''
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



app.get('/', function (req, res) {
	//using simple html file to connect to
    res.sendFile('register.html', {root: __dirname})
});


//connection to database is successfull but i am having trouble with actually inserting the data
app.post('/submit', function(req, res) {
    let name = req.body.name;
    let email = req.body.password;
    let password = req.body.email;

     const sql = `INSERT INTO newusers (name, password, email)
       VALUES ('${name}','${password}', '${email}')`;
         db.query(sql, (err, res)=> {
        if (err) throw err
        res.render('registration', { title: 'Data Daved', message: 'Data saved successfully' })
    })
    connection.end();
});


app.listen(3000);
