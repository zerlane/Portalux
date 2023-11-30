//Nautishay - added MySQL connection using pool instead of connection

//https://www.youtube.com/watch?v=Hej48pi_lOc
import mysql from 'mysql2'

//setting enviroment variables
import dotenv from 'dotenv'
dotenv.config()

//create pool to allow multiple connections
export const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    multipleStatements: true,
}).promise()

await pool.getConnection((err, connection) => {
    if (err) {
        console.error(err.message)
        return
    }

    console.log('Successfully connected to MySQL pool connection.')
    //connection made available again in pool
    connection.release()
})


