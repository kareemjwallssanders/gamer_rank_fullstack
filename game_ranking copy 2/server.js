const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const mongoose = require('mongoose');
const morgan = require('morgan');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
var multer = require('multer');
var ObjectId = require('mongodb').ObjectID

app.use(cookieParser());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

const configDB = require('./config/database.js');
mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.log(err)
  require('./app/routes.js')(app, passport, database, multer, ObjectId);
});

require('./config/passport.js')(passport);

app.set('view engine', 'ejs');

app.use(session({
    secret: 'ga',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.listen(port);
console.log(`When you wish upon... ${port}`);
