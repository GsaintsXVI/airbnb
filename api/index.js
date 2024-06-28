const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('./models/User')
const Place = require('./models/Place')
const cookieParser = require('cookie-parser')
const imageDownloader = require('image-downloader')
const multer = require('multer')
const fs = require('fs')
require('dotenv').config()
const app = express()
const port = 4000

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'aegkqwpepklalagsskd'
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads/'))
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
        res.status(422).json("Pass is not okay")
    }
})
app.get('/profile', (req, res) => {
    const { token } = req.cookies
    if (!token) return res.json(null)
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err
        const { name, email, _id } = await User.findById(userData.id)
        res.json({ name, email, _id })
    })
})
app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true)
})
console.log({ __dirname })
app.post('/upload-by-link', async (req, res) => {
    const { link } = req.body
    if(!link) return res.status(400).json('No link')
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
        url: link,
        dest: __dirname + '/uploads/' + newName
    });
    res.json(newName)
})

const photosMiddleware = multer({ dest: 'uploads/' });

app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
    // console.log(req.files);
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        // const element = array[i];
        const { path, originalname } = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        // console.log(newPath.replace('uploads/',''));
        uploadedFiles.push(newPath.replace('uploads\\', ''));
    }
    console.log(uploadedFiles);
    res.json(uploadedFiles);
})

app.post('/places', (req, res) => {
    const { token } = req.cookies
    console.log("req.body", req.body);
    const { title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests } = req.body
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err
        const placeDoc = await Place.create({
            owner: userData.id,
            title, address, photos: addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price
        });
        console.log("placeDoc", placeDoc);
        res.json(placeDoc);
    })

})
app.get('/places', async (req, res) => {
    res.json( await Place.find() )
})
app.get('/user-places', (req, res) => {
    const { token } = req.cookies
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err
        const { id } = userData;
        console.log("id", id);
        const placeDoc = await Place.find({ owner: id })
        console.log("placeDoc", placeDoc);
        res.json(placeDoc);
    })
})
app.get('/places/:id', async (req, res) => {
    const { id } = req.params
    console.log("/places/:id", id);
    const placeDoc = await Place.findById(id)
    console.log("placeDoc", placeDoc);
    res.json(placeDoc)
})
app.put('/places', async (req, res) => {
    const { token } = req.cookies
    const { id, title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests,price } = req.body
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err
        const placeDoc = await Place.findById(id);
        if (userData.id === placeDoc.owner.toString()) {
            placeDoc.set({
                title, address, photos: addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests,price
            })
            await placeDoc.save();
            res.json('ok');
        }
    })

})

app.listen(port)
// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`)
// })

// booking
// 57£*n6i+Jodz