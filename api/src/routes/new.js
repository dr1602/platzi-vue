const express = require("express")
const sgMail = require("../sendgrid.js")

const router = express.Router()
router.post('/api/mail', async (req,res) =>{
    const {to, subject, text} = req.body

    const msg = {
        to,
        from: "no-reply@certiblocks.io",
        subject,
        text
    }

    try {
        await sgMail.send(msg)
        console.log('Email sent')
    } catch(err){
        return res.status(err.code).send(err.message)
    }

    res.send(201)
})

module.exports = router