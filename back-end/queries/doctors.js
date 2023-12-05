import { pool } from '../mysql.js'

/*
    This is where the mysql queries regarding doctors will be stored to dynamically fetch
    MySQL data.

    Only one query was needed to get all doctors since we only worked with api's for patients
    and appointments.
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

