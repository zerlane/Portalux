//requires express library
import express from 'express'
import bodyParser from 'body-parser'
import { router } from './back-end/routes/routes.js'
import path from 'path'
import bcrypt from 'bcrypt'
import session from 'express-session'
import { fileURLToPath } from 'url'
import mysql from 'mysql'
import { pool } from './back-end/Database Connection/mysql.js'
import { insertPatient, emailExists } from './back-end/Database Connection/queries/patients.js'


//creates new express app
const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.set("view engine", "ejs")

//npm i express mysql ejs nodemon bcrypt express-session


app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke.')
})

//homepage
router.use(bodyParser.json())
app.use('/', router)


app.use(express.static("front-end"))

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
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
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
            var sql = "CREATE TABLE IF NOT EXISTS bb_database.patients (id INT AUTO_INCREMENT PRIMARY KEY, fname CHAR(75) NOT NULL, lname CHAR(75) NOT NULL, dob DATE NOT NULL, address TEXT(150) NOT NULL, email VARCHAR(75) NOT NULL, phone VARCHAR(10) NOT NULL, gender CHAR(6) NOT NULL, password VARCHAR(60) NOT NULL, imgpwd VARCHAR(60) NOT NULL)";
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


app.get('/profile', (req, res) => {
    // Retrieve the user data from the session
    const user = req.session.user;

    // Render the profile page with the retrieved user data
    res.render('profile', { user: user });
});




//-----------------------------------------------------------------------------------------post requests----------------------------------------------------------------------------------------

//post request for signuppage
app.post('/signuppage', async (req, res) => {
    try {
        let fname =req.body.first_name;
	    let lname = req.body.last_name;
	    let dob = req.body.dob;
	    let address = req.body.address;
  	    let email = req.body.email;
	    let phone = req.body.phone;
	    let gender = req.body.gender;
        let password = req.body.password;
        let imgpwd = req.body.imgpwd;

        if (emailExists(email)) {
            return res.render('signuppage', { msg: 'Email already exists', msg_type: 'error' }  );
        }

        const hashedPassword = await bcrypt.hash(password, 8);
        await insertPatient(fname, lname, dob, address, email, phone, gender, hashedPassword, imgpwd)

        res.redirect('/login')
        
    } catch (error) {
        console.error(`Can't make a post request to insert new patient`)
    }
})

//post request for login page
app.post('/login', async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password

        if (!emailExists(email)) {
           return res.render('login',{ msg: 'User does not exist.', msg_type: 'error' })
        }
    } catch (error) {
        
    }
})
// app.post('/login',  (req, res) =>{
//     //retrieving data
//     let email = req.body.email;
//     let pw = req.body.password;

//     //selecting all data from databse
//     pool.query('SELECT * FROM Patients WHERE email=?', [email], async (error, result) => {
//         if(error){
//             console.log(error);
//         }
//         console.log(result);
//         //checking if user exists
//         if (result.length === 0) {
//             //displaying error message if user is not found in database
//             return res.render('login', { msg: 'User does not exist.', msg_type: 'error' }  );
//         }
//         else{
//             //cheching if given requested password matches the hashed password stored in database
//             //redirects to profile page if password match
//             if(!(await bcrypt.compare(pw, result[0].password))){
//                 return res.render('login', { msg2: 'Password is incorrect', msg_type: 'error' }  );
//             }
//             else{
//                 req.session.user = result[0];
//                 res.redirect('/profile');
//             }
//         }
        
//     });
// });


// Set the port for the server to listen on
const port = 3000; 

app.listen(port, () => {
    console.log(`Server is running on port localhost:${port}/welcome`);
});





//https://www.tutorjoes.in/blog/node_js#google_vignette
//chatgpt