const mysql = require('mysql');
const connection = mysql.createConnection({
	host:'localhost',
	port:3306,
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
