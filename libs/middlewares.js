const morgan = require('morgan');
const session = require('express-session');
module.exports = (app, express) => {
    //middlewares
    app.use(morgan('dev'));
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(express.static('client'));
    app.use(
        session({
            secret: process.env.SESSION_HASH,
            resave: false,
            saveUninitialized: true
        })
    );
}