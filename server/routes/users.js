const { Router } = require('express');
const router = Router();

router.get('/login', (req, res) => {
    res.render('user/login', {title: 'Reactive Notes | Login'});
});

module.exports = router;