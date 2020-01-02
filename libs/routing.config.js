const authMiddleware = require('../server/Controllers/auth.controller');

module.exports = (app, express) => {
    //routes
    app.get('/', authMiddleware, (req,res,next) => next(), (req, res) => {
        res.render('home/index', {title: 'Reactive Notes | Main Page'});
    });
    app.use('/', require('../server/routes/home'));
    app.use('/user', require('../server/routes/users'));
    app.use('/api/users', require('../server/routes/api.users'));
}