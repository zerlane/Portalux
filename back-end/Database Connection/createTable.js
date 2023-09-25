const mysql = require('mysql');
const connection = mysql.createConnection({
	host:'localhost',
	port:3306,
	user:'root',
	password:'',
    database: 'registration'
});

connection.connect(function(error){
	if(error)
	{
		console.log('Cannot connect to database.');
	}
	else{
		console.log('Connection to database successful.');
	}

    var sql = "CREATE TABLE newusers (name VARCHAR(20), password VARCHAR(20), email VARCHAR(20))";

    connection.query(sql, function (err, result) {
        if (err) throw err
		console.log("Table Created.");
    });
});
