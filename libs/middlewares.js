const morgan = require('morgan');
const session = require('express-session');
const sequelizeStore = require('connect-session-sequelize')(session.Store);
const dbContext = require('../models/db.context');

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
            saveUninitialized: true,
            store: new sequelizeStore({
                db: dbContext.sequelize,
                checkExpirationInterval: 15 * 60 * 1000,
                expiration: 24 * 60 * 60 * 1000,
                table: 'Session',
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