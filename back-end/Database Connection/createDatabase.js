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
		console.log('Connection Unsuccessful.');
	}
	else{
		console.log('Connection Successful.');

	}
});

connection.query("CREATE DATABASE registration", function (error, result) {
	if (error) throw error;
    		console.log("Database created");
});

connection.end();
