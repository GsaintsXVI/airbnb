const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('./models/User')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const app = express()
const port = 4000

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'aegkqwpepklalagsskd'
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}))

console.log(process.env.MONGO_URL)
mongoose.connect(process.env.MONGO_URL)

app.get('/test', (req, res) => {
    res.send('Hello World!')
})

app.post('/register', async (req, res) => {
    console.log("register", req.body);
    const { name, email, password } = req.body
    try {
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt)
        })
        res.json(userDoc)
    } catch (e) {
        res.status(422).json(e)
    }

})
app.post('/login', async (req, res) => {
    const { email, password } = req.body
    const userDoc = await User.findOne({ email })
    if (userDoc) {
        console.log("userDoc", userDoc);
        const passOK = bcrypt.compareSync(password, userDoc.password)
        if (passOK) {
            //logged in
            console.log("passOK", passOK);
            //generate token
            jwt.sign({
                id: userDoc._id,
                email: userDoc.email,

            }, jwtSecret, {}, (err, token) => {
                if (err) throw err
                res.cookie('token', token).json(userDoc)
            })

        } else {
            console.log("Pass is not okay")
            res.status(422).json("Pass is not okay")
        }
    } else {
        console.log("Not found")
        res.json("Not found")
    }
})
app.get('/profile', (req, res) => {
    const { token } = req.cookies
    if (!token) return res.json({})
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err
        const {name, email, _id} = await User.findById(userData.id)
        res.json({name, email, _id})
    })
})
app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true)
})
app.listen(port)
// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`)
// })

// booking
// 57£*n6i+Jodz