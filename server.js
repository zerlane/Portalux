//requires express library
import express from 'express'
import bodyParser from 'body-parser'
import { router } from './back-end/routes/appointmentRoutes.js'
import path from 'path'
import bcrypt from 'bcrypt'
import session from 'express-session'
import { fileURLToPath } from 'url'
import mysql from 'mysql'
import { pool } from './back-end/mysql.js'
import { insertPatient, emailExists, getOnePatient } from './back-end/Database Connection/queries/patients.js'


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


router.use(bodyParser.json())

app.use(express.static("front-end"))

// Set up session middleware
//needed for profile display
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));
//parsing requests
app.use(express.urlencoded({ extended: false }));
//path to public directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const location = path.join(__dirname, "./public");
//serves static files in public folder
app.use(express.static(location));
//setting view engine
app.set('view engine', 'ejs');


//-------------------------------------------------------------------------get requests------------------------------------------------------------------------

//routes
app.get('/', (req, res) => {
    res.render('welcome')
})
app.get('/signuppage', (req, res) => {
    res.render("signuppage");
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/profile', (req, res) => {
    // Retrieve the user data from the session
    const user = req.session.user;

    // Render the profile page with the retrieved user data
    res.render('profile', { user });
});

app.get('/welcome', (req, res) => {
    res.redirect('/');
});

app.get('/home', (req, res) => {
    const user = req.session.user;
    
    res.render('home', { user })
})

app.get('/medicalhistory', (req, res) => {
    const user = req.session.user;

    res.render('medicalHistory', { user })
})

//implemented in the future
app.get('/billing', (req, res) => {
    res.redirect('/medicalHistory')
})

app.get('/prescriptions', (req, res) => {
    res.render('Prescriptions')
})

app.use('/appointments', router)

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            throw err
        }
        console.log(`User has been logged out.`)
        res.redirect('/')
    })
})

//-----------------------------------------------------------------------------------------post requests----------------------------------------------------------------------------------------

//post request for signuppage
app.post('/signuppage', async (req, res) => {
    try {
        let fname = req.body.first_name;
        let lname = req.body.last_name;
        let dob = req.body.dob;
        let address = req.body.address;
        let email = req.body.email;
        let phone = req.body.phone;
        let gender = req.body.gender;
        let password = req.body.password;
        let imgpwd = req.body.imgpwd;

        const emailInDB = await emailExists(email)

        if (emailInDB) {
            return res.render('signuppage', { msg: 'Email already exists', msg_type: 'error' });
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
        const imgpwd = req.body.imgpwd
        const result = await getOnePatient(email)

        if (result === false) {
            return res.render('login', { msg: 'User does not exist.', msg_type: 'error' })
        }

        let comparePW = await bcrypt.compare(password, result[0].password)
        let compareImgPwd = imgpwd === result[0].imgpwd

        if(comparePW && compareImgPwd) {
            req.session.user = result[0]

            req.session.save((err) => {
                if(err) {
                    throw err
                }
                
                res.redirect('/profile')

            })
        } else {
            return res.render('login', { msg2: 'Password is incorrect', msg_type: 'error' });
        }


    } catch (error) {
        console.error
    }
})


// Set the port for the server to listen on
const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on port localhost:${port}/welcome`);
});





//https://www.tutorjoes.in/blog/node_js#google_vignette
//chatgpt