import { pool } from '../mysql.js'

/*
    This is where all the mysql queries regarding patients will be stored to dynamically fetch
    MySQL data.
*/

export const insertPatient = async (fName, lName, dob, address, email, phone, gender, password, imgpwd) => {
    try {
           
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

export const getOnePatient = async (email) => {
    try {
        const [patient] = await pool.query(
            `SELECT * FROM Patients WHERE email = ?`, 
            [email]
        )
        if(patient.length === 0) {
            return false
        }
        return patient
    } catch (err) {
        console.error(`Couldn't get patient with this email: ${err}`)
    }
}

export const getPatientAppts = async (id) => {
    try {
        const [patientAppts] = await pool.query(`
            SELECT app.id, doc.first_name, doc.last_name, doc.specialty, app.appointment_date,
                TIME_FORMAT(app.appointment_time, '%h:%i %p') AS appointment_time,
                p.id as patient_id
            FROM ((Appointments AS app
                INNER JOIN Doctors AS doc
                    ON app.doctor_id = doc.id)
                INNER JOIN Patients AS p
                ON app.patient_id = p.id)
                WHERE p.id = ?`, [id])
        if(patientAppts.length === 0) {
            console.log(`Patient has no scheduled appointments`)
            return null
        }
        return patientAppts
    } catch (err) {
        console.error(`Error getting all scheduled appts for patients on the appt table: ${err}`)
        throw err
    }
}
