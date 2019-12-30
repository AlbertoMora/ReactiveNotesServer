const dbContext = require('../models/db.context');

module.exports = (req, res, next) => {
    const sessionId = req.session.id;
    console.log(sessionId);
    dbContext.session.findAll({ where: { sId: sessionId } })
        .then(r => {
            if (r.length > 0) {
                console.log(r)
                next();
            } else {
                res.redirect('/users/login');
            }
        })
        .catch(err => {
            res.redirect('/users/login');
        });
};