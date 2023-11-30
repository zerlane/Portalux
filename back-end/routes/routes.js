import express from 'express'
import { getDoctors } from '../Database Connection/queries/doctors.js'
import { getAllAvailAppts, getAvailApptByDoc, getAvailApptByDate, getAvailApptsDateNDoc ,cancelAppt, scheduleAppt } from '../Database Connection/queries/appointments.js'

export const router = express.Router()

router.get('/', async (req, res) => {
    res.render('welcome')
})

router.get('/appointments', async (req, res) => {   
    const doctors = await getDoctors()
    const allAvailAppts = await getAllAvailAppts()
    
    try {
        res.render('appointment', { doctors, allAvailAppts })
    
    } catch (err) {
        res.status(500).json({ error: err.message})
    }    
})

//pass through JSON data for available doctor or available appointment
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

router.patch('/appointments/schedule/:id', async (req, res) => {
    try {
        const id = req.params.id
        const appointment = await scheduleAppt(id)
        res.json({ appointment })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }

})

router.patch('/appointments/cancel/:id', async (req, res) => {
    try {
        const id =  req.params.id
        const appointment = await cancelAppt(id)
        
        res.json({ appointment })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }

})