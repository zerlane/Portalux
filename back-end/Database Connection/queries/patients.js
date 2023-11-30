import { pool } from '../mysql.js'

/*
    This is where all the mysql queries regarding patients will be stored.
*/

export const insertPatient = async (fName, lName, dob, address, email, phone, gender, password, imgpwd) => {
    try {
        //check if email exists in the database already
        

            const [patient] = await pool.query(
                `INSERT INTO Patients (first_name, last_name, dob, address, email, phone, gender, password, imgpwd) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`, 
                    [fName, lName, dob, address, email, phone, gender, password, imgpwd]
            )
            return patient
       

    } catch (err) {
        console.error(`Error inserting new patient: ${err}`)
        throw err
    }
}

export const emailExists = async (email) => {
    try {
        const [result] = await pool.query(
            `SELECT email FROM Patients WHERE email =?`, 
            [email]
        )
        
        const resultLen = result.length

        if (resultLen == 1) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.error(`Error catching email in patient database.`)
    }
}



