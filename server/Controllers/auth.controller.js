const dbContext = require('../../models/db.context');

module.exports = (req, res, next) => {
    const sessionId = req.session.id;
    const userId = req.session.userId;
    console.log(sessionId);
    dbContext.session.findAll({ where: { sId: sessionId, userId: userId } })
        .then(r => {
            if (r.length > 0) {
                console.log(r)
                next();
            } else {
                res.redirect('/user/login');
            }
        })
        .catch(err => {
            res.redirect('/user/login');
        });
};