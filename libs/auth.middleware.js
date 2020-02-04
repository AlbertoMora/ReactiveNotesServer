const dbContext = require('../models/db.context');

module.exports = (req, res, next) => {
    const sessionId = req.session.id;
    dbContext.session.findAll({ where: { sId: sessionId } })
        .then(r => {
            if (r.length > 0) {
                console.log(r)
                next();
            } else {
                res.redirect('/account/login');
            }
        })
        .catch(err => {
            res.redirect('/account/login');
        });
};