const authMiddleware = require('./auth.middleware');
module.exports = (app, express) => {
    //routes
    app.get('/', authMiddleware, (req, res) => {
        res.render('home/index', {title: 'Reactive Notes | Main Page'});
    });
    app.use('/', require('../server/routes/home'));
    app.use('/api/users', require('../server/routes/users'));
    app.use('/account', require('../server/routes/account'));
}