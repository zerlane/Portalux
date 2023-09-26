const mysql = require('mysql');
const connection = mysql.createConnection({
	host:'localhost',
	port:3306,
	user:'root',
	password:'password',
    	database: 'registration'
});

connection.connect(function(error){
	if(error)
	{
		console.log('Connection Unsuccessful.');
	}
	else{
		console.log('Connection Successful.');
	}

    var sql = "SELECT * from newusers";

    connection.query(sql, function (error, result) {
        if (error) throw error
		console.log(result);
    });
});
