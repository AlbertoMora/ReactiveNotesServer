module.exports = (app, express) => {
    //routes
    app.get('/', (req,res,next) => next(), (req, res) => {
        res.render('home/index', {title: 'Reactive Notes | Main Page'});
    });
    app.use('/', require('../server/routes/home'));
    app.use('/api/users', require('../server/routes/users'));
}