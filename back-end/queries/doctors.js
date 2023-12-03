import { pool } from '../../mysql.js'

/*
    All of the queries needed to list doctors, get a specific doctor,
    create a doctor, and delete a doctor are listed in this file. 
*/

//get all doctors
export const getDoctors = async () => {
    try {
        const [doctors] = await pool.query('SELECT * FROM Doctors')
        return doctors
    } catch (err) {
        console.log(`Error getting all doctors: ${err}`)
    } 
}

// get single doctor
export const getDoctor = async (id) => {
   try { 
        const [doctor] = await pool.query(
        `SELECT * FROM Doctors WHERE id = ?`, [id]) //prepared statement
        return doctor[0]
    } catch (err) {
        console.log(`Error getting doc with id ${id}: ${err}`)
    }
}


//get doctor by first name
export const getDocByFName = async (first_name) => {
    try {
        const [doctor] = await pool.query(
            `SELECT first_name, last_name, specialty FROM Doctors 
                WHERE first_name = ?`, ['%' + first_name + '%']) //prepared statement
        return doctor[0]
    } catch (err) {
        console.log(`Error finding doc with first name ${first_name}: ${err} `)
    }
}

//get doctor by last name
export const getDocByLName = async (last_name) => {
    try {
        const [doctor] = await pool.query(
            `SELECT first_name, last_name, specialty FROM Doctors 
                WHERE last_name LIKE ?`, ['%' + last_name + '%']) //prepared statement
        return doctor[0]
    } catch (err) {
        console.log (`Error finding doctor with last name ${last_name}: ${err}`)
    }
}

//add doctor
export const createDoctor = async (first_name, last_name, email, phone, specialty) => {
    try {
        const doctor = await pool.query(`
         INSERT INTO Doctors (first_name, last_name, email, phone, specialty)
         VALUES (?, ?, ?, ?, ?)`,
        [first_name, last_name, email, phone, specialty])
        return doctor
    } catch (err) {
        console.log(`Error creating doctor: ${err}`)
    }
}

//remove doctor
export const deleteDoctor = async (id) => {
    try {
        const [doctor] = await pool.query(
            `DELETE FROM Doctors WHERE id = ?`, [id]
        )
        return doctor
    } catch (err) {
        console.log(`Error deleting doctor with id ${id}, ${err}`)
    }
}
