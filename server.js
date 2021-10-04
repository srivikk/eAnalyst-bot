const https = require('https')
const express = require('express');
require('dotenv').config()
const mongoose = require('mongoose');

const fs = require('fs')

const bodyParser = require('body-parser');

const path = require('path');

//routes
const crudRouter = require('./routes/crud-routes');
const api = require('./routes/api');
const index = require('./routes/index');

// Express settings
const app = express();
const port = 3001;

// Connect to MongoDB with Mongoose
mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true }).catch(err => console.log(err));
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to mongodb')
});

//set view engine for server rendering
app.set('view engine', 'ejs');
app.set('views', 'client/views');

// Bodyparser Middleware
app.use(bodyParser.json({ limit: '50mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

// Serve static files from public folder
app.use(express.static('client/public'));

// ---------------- API Routes ------------------
app.use('/db_api', crudRouter);

app.use('/api', api);

app.use('/', index);

// error handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
});

app.use('/auth/assets', express.static(path.join(__dirname, 'views/assets')));

https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
}, app).listen(port, () => {
    console.log(`Listening at ${port}...`)
})