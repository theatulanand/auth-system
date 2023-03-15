require('dotenv').config();

const express = require('express');
const app = express();
const router = require('./routes');
const DbConnect = require('./database');
const cors = require('cors');
const cookieParser = require('cookie-parser')
app.use(cookieParser());
const corsOption = {
    AccessControlAllowOrigin: 'https://pococare-assignment.netlify.app/',
    origin: 'https://pococare-assignment.netlify.app/',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}

app.use('/storage', express.static('storage'));

const PORT = process.env.PORT || 5500;

function logger(req, res, next) {
    console.log(req.method, new Date(), req.url);
    next();
}

DbConnect()

app.use(cors(corsOption));
app.use(logger)
app.use(express.json({ limit: '10mb' }));
app.use(router);


app.get("/", (req, res) => {
    res.send("Hello my server is running");
    return
})

app.listen(PORT, () => { console.log(`Server is running at port: ${PORT}`) })