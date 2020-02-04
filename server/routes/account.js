const { Router } = require('express');
const router = Router();

router.get('/login', (req, res) => {
    res.render('account/login', {title: 'Reactive Notes | Login'});
});

module.exports = router;