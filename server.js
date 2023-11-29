//install dependencies

//npm i express mysql ejs nodemon bcrypt express-session


const mysql = require('mysql');
const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');





// Set up session middleware
//needed for profile display
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));
//parsing requests
app.use(express.urlencoded({ extended: false}));
//path to public directory
const location = path.join(__dirname, "./public");
//serves static files in public folder
app.use(express.static(location));
//setting view engine
app.set('view engine', 'ejs');




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



//-------------------------------------------------------------------------get requests------------------------------------------------------------------------


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

app.get('/home', (req, res) =>{
    res.render('home');
})


app.get('/profile', (req, res) => {
    // Retrieve the user data from the session
    const user = req.session.user;

    // Render the profile page with the retrieved user data
    res.render('profile', { user: user });
});

app.get('/Appointment', (req, res) => {
    res.render('Appointment');
})




//-----------------------------------------------------------------------------------------post requests----------------------------------------------------------------------------------------


//post request for signuppage
app.post('/signuppage', function (req, res) {
    	//retrieving data
	var fname =req.body.fname;
	var lname = req.body.lname;
	var dob = req.body.dob;
	var address = req.body.address;
  	var email = req.body.email;
	var phone = req.body.phone;
	var gender = req.body.gender;
    	var password = req.body.password;

    //selecting email from database 
    connection.query('SELECT email FROM bb_database.patients WHERE email=?', [email], async (error, result) =>{
        if(error){
            console.log(error);
        }
        //checking if email already exists in database
        if(result.length>0){
            //displays error message if email already exists
            return res.render('signuppage', { msg: 'Email already exists', msg_type: 'error' }  );

        }
        else{
            //hashing password using bcrypt and storing hashed password in database
            let hashedPassword = await bcrypt.hash(password, 8);
            //storing patient data in database
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
    //retrieving data
    var email = req.body.email;
    var pw = req.body.password;

    //selecting all data from databse
    connection.query('SELECT * FROM bb_database.patients WHERE email=?', [email], async (error, result) => {
        if(error){
            console.log(error);
        }
        console.log(result);
        //checking if user exists
        if (result.length === 0) {
            //displaying error message if user is not found in database
            return res.render('login', { msg: 'User does not exist.', msg_type: 'error' }  );
        }
        else{
            //cheching if given requested password matches the hashed password stored in database
            //redirects to profile page if password match
            if(!(await bcrypt.compare(pw, result[0].password))){
                return res.render('login', { msg2: 'Password is incorrect', msg_type: 'error' }  );
            }
            else{
                req.session.user = result[0];
                res.redirect('/home');
            }
        }
        
    });
});

app.post('/profile',  (req, res) =>{
    res.redirect('/profile');
});

app.post('/appoinments', (req, res) => {
    res.redirect('/Appointment');
})





// Set the port for the server to listen on
const port = 3000; 

app.listen(port, () => {
    console.log(`Server is running on port localhost:${port}/welcome`);
});





//https://www.tutorjoes.in/blog/node_js#google_vignette
//chatgpt
