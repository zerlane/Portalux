import { pool } from '../mysql.js'

/*
    This is where all the mysql queries regarding appointments will be stored.
*/

//get all available appointments
export const getAllAvailAppts = async () => {
    try {
        const [appointments] = await pool.query(
            `SELECT app.id, doc.first_name, doc.last_name, doc.specialty, app.appointment_date, TIME_FORMAT(app.appointment_time, '%h:%i %p') as appointment_time
                FROM Appointments as app
                LEFT JOIN Doctors as doc
                ON app.doctor_id = doc.id
                WHERE app.current_status = 'Free';`
        )
        return appointments
    } catch (err) {
        console.error(`Couldn't get all available appointments: ${err}`)
        throw err
    }
}

//search available appointment by doctor
export const getAvailApptByDoc = async (doctor) => {

    try {
        const first_name = await doctor.substring(0, doctor.indexOf(' '))
        const last_name = await doctor.slice(doctor.indexOf(' ') + 1)

        const [appointments] = await pool.query(
            `SELECT app.id, doc.first_name, doc.last_name, doc.specialty, app.appointment_date, TIME_FORMAT(app.appointment_time, '%h:%i %p') as appointment_time, app.current_status
                FROM Appointments as app
                LEFT JOIN Doctors as doc
                ON app.doctor_id = doc.id
                WHERE app.current_status = 'Free'
                 AND (doc.first_name LIKE ? AND doc.last_name LIKE ?)`,
            ['%' + first_name + '%', '%' + last_name + '%']
        )
        return appointments
    } catch (err) {
        console.error(`Couldn't find available appointment for this doctor: ${err}`)
        throw err
    }
}

//search available appointment by date
export const getAvailApptByDate = async (availDate) => {
    try {
        const [appointments] = await pool.query(
            `SELECT app.id, doc.first_name, doc.last_name, doc.specialty, app.appointment_date, TIME_FORMAT(app.appointment_time, '%h:%i %p') as appointment_time, app.current_status
             FROM Appointments as app
             LEFT JOIN Doctors as doc
                ON app.doctor_id = doc.id
             WHERE app.current_status = 'Free'
                AND app.appointment_date = STR_TO_DATE(?, '%Y-%m-%d')`,
            [availDate]
        )
        return appointments
    } catch (err) {
        console.error(`Couldn't find an available appointment with this date: ${err}`)
        throw err
    }
}

//get available appointment for doctor and date
export const getAvailApptsDateNDoc = async (availDate, doctor) => {
    try {
        const first_name = await doctor.substring(0, doctor.indexOf(' '))
        const last_name = await doctor.slice(doctor.indexOf(' ') + 1)

        const [appointments] = await pool.query(
            `SELECT app.id, doc.first_name, doc.last_name, doc.specialty, app.appointment_date, TIME_FORMAT(app.appointment_time, '%h:%i %p') as appointment_time, app.current_status
            FROM Appointments as app
            LEFT JOIN Doctors as doc
               ON app.doctor_id = doc.id
            WHERE app.current_status = 'Free'
               AND app.appointment_date = STR_TO_DATE(?, '%Y-%m-%d')
               AND (doc.first_name LIKE ? AND doc.last_name LIKE ?)`,
            [availDate, '%' + first_name + '%', '%' + last_name + '%']
        )
        return appointments
    } catch (err) {
        console.error(`Couldn't find an available appointment for this date and doctor: ${err}`)
        throw err
    }
}

//schedule appt - call ScheduleAppt stored procedure
export const scheduleAppt = async (appt_id, patient_id) => {
    try {
        const scheduleApptQuery = await pool.query(`CALL ScheduleAppt(?, ?)`, [appt_id, patient_id])
        console.log(`Appointment successfully scheduled.`)
        return scheduleApptQuery
    } catch (err) {
        console.error(`Unable to schedule appointment: ${err}`)
        throw err
    }
}

//cancelled appointment 
export const cancelAppt = async (appt_id, patient_id) => {
    try {
        const cancelApptQuery = await pool.query(`CALL CancelAppt(?, ?)`, [appt_id, patient_id])
        console.log(`Appointment successfully cancelled.`)
        return cancelApptQuery
    } catch (err) {
        console.error(`Couldn't cancel the appointment: ${err}`)
        throw err
    }
}

