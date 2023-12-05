import express from 'express'
import { getDoctors } from '../queries/doctors.js'
import { getAllAvailAppts, getAvailApptByDoc, getAvailApptByDate, getAvailApptsDateNDoc ,cancelAppt, scheduleAppt } from '../queries/appointments.js'
import { getPatientAppts } from '../queries/patients.js'

export const router = express.Router()

//GET request for the appointment page to load all doctors, available appointments, patient, and patient's appointment
router.get('/', async (req, res) => {   
    const doctors = await getDoctors()
    const allAvailAppts = await getAllAvailAppts()
    const user = req.session.user
    const userAppts = await getPatientAppts(user.id)
    
    try {
        res.render('Appointment', { doctors, allAvailAppts, user, userAppts })
    
    } catch (err) {
        res.status(500).json({ error: err.message})
    }    
})

//GET request to pass through JSON data for available doctor, available appointment, or both 
router.get('/appointments.json', async (req, res) => {
    const availDate = req.query.appointment_date
    const availDoctor = req.query.first_name
    const allAvailAppts = await getAllAvailAppts()

    //When passed through on client side, the space is read at %20 (UTF-8 Character), has to be decoded
    const decodedDoc = decodeURIComponent(availDoctor)

    try {
        const availByDate = await getAvailApptByDate(availDate)
        const availByDoctor = await getAvailApptByDoc(decodedDoc)
        const availByDateNDoc = await getAvailApptsDateNDoc(availDate, decodedDoc)

        if (availDate && availDoctor) {
            res.json(availByDateNDoc)    
        } else if (availDate) {
            res.json(availByDate)
        } else if (availDoctor) {
            res.json(availByDoctor)
        } else {
            res.json(allAvailAppts)
        }

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

//patch request to schedule the appointment in regards to appointment id
router.patch('/schedule/:id', async (req, res) => {
    try {
        const id = req.params.id
        const user = req.session.user
        const appointment = await scheduleAppt(id, user.id)
       
        res.json({ appointment, user })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }

})

//patch request to cancel the appointment in regards to appointment id
router.patch('/cancel/:id', async (req, res) => {
    try {
        const id =  req.params.id
        const user = req.session.user
        const appointment = await cancelAppt(id, user.id)
        
        res.json({ appointment, user })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }

})