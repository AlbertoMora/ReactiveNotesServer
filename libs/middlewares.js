const morgan = require('morgan');
const dbContext = require('../models/db.context');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

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
            saveUninitialized: false,
            store: new SequelizeStore({
                db: dbContext.sequelize,
                checkExpirationInterval: 15 * 60 * 1000,
                expiration: 24 * 60 * 60 * 1000,
                table: 'session',
                extendDefaultFields: extendDefaultFields
            })
        })
    );
}

function extendDefaultFields(defaults, session) {
    return {
      data: defaults.data,
      expires: defaults.expires,
      userId: session.userId
    };
  }