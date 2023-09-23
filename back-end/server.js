//requires express library
const express = require('express')
//creates new express app
const app = express()
app.set("view engine", "ejs")

const port = 3000

//http request from root and renders html with passed data
app.get('/', (req, res) => {
    res.render("sample.ejs", {
        message: String.fromCodePoint(0x1F430)   //passing data to sample.ejs
    })
})

app.use(express.static("public"))

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})