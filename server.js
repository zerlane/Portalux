const mysql = require('mysql');
const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs');
const bcrypt = require('bcrypt');

//creating connection 
const connection = mysql.createConnection({
	host:'localhost',
	port:3306,
	user:'root',
	password:'password',
});

//creating database and table
connection.connect(function(error){
	if(error)
	{
		console.log(error);
	}
	else{
		console.log('Connection Successful.');
        connection.query('CREATE DATABASE IF NOT EXISTS bb_database', function(error, result){
            if(error)
            {
                console.log(error)
            }
            else{
                console.log('Database created.')
            }

        })
    }

            //creating table
            var sql = "CREATE TABLE IF NOT EXISTS bb_database.patients (id INT AUTO_INCREMENT PRIMARY KEY, fname CHAR(75) NOT NULL, lname CHAR(75) NOT NULL, dob DATE NOT NULL, address TEXT(150) NOT NULL, email VARCHAR(75) NOT NULL, phone VARCHAR(10) NOT NULL, gender CHAR(6) NOT NULL, password VARCHAR(60) NOT NULL)";
            connection.query(sql, function (error, result) {
                if (error)
                {
                    console.log(error)
                }
                else{
                    console.log("Table Created.");
                }
            });
    
    
});

//middleware to parse data
app.use(express.urlencoded({ extended: false }));
//css files stored in public folder
const location = path.join(__dirname, "./public");
app.use(express.static(location));
//setting view engine
app.set('view engine', 'ejs');


//routes
app.get('/welcome', (req, res) =>{
	res.render("welcome");
});

app.get('/signuppage', (req, res) =>{
	res.render("signuppage");
});

app.get('/login', (req, res) => {
    res.render('login');
});



//post request for signuppage
app.post('/signuppage', function (req, res) {
    var fname =req.body.fname;
  	var lname = req.body.lname;
	var dob = req.body.dob;
	var address = req.body.address;
  	var email = req.body.email;
	var phone = req.body.phone;
	var gender = req.body.gender;
    var password = req.body.password;

    connection.query('SELECT email FROM bb_database.patients WHERE email=?', [email], async (error, result) =>{
        if(error){
            console.log(error);
        }
        //checking if email already exists in database
        if(result.length>0){
            res.send('Email already exists.');
            //code to display msg on page goes here

        }
        else{
            //hashing password using bcrypt and storing hashed password in database
            let hashedPassword = await bcrypt.hash(password, 8);
            //inserting patient data in database
	        var sql = "INSERT INTO bb_database.patients (fname, lname, dob, address, email, phone, gender, password) VALUES ('"+fname+"', '"+lname+"','"+dob+"', '"+address+"','"+email+"', '"+phone+"', '"+gender+"', '"+hashedPassword+"')";

            //performs sql query and if no errors occur, user is redirected to the login page
            connection.query(sql, function (error, result) {
                if (error) {
                    console.error('Error inserting data into MySQL:', error);
                    res.status(500).send('Error: Data insertion failed.');
                }
                else{
                    console.log(result);
                    res.redirect('/login');
                }
            });
        }
    });
});


//post request for login page
app.post('/login',  (req, res) =>{
    var email = req.body.email;
    var pw = req.body.password;


    connection.query('SELECT * FROM bb_database.patients WHERE email=?', [email], async (error, result) => {
        if(error){
            console.log(error);
        }
        console.log(result);
        //checking if user exists
        if (result.length === 0) {
            res.send('Email does not exist.');
            //code to display msg on page goes here
        }
        else{
            //cheching if given requested password matches the hashed password stored in database
            //redirects to profile page if password match
            if(!(await bcrypt.compare(pw, result[0].password))){
                res.send('Password is incorrect');
            }
            else{
                res.send('This is the profile page.');
                //res.redirect('/profile');
            }
        }
        
    });
});







// Set the port for the server to listen on
const port = 3000; 

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
