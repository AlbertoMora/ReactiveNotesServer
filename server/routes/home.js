const { Router } = require('express');
const router = Router();
const AuthMiddleware = require('../Controllers/auth.controller');

const appRender = (title) => {
    return function (req, res) {
        res.render('home/index', { title: `Reactive Notes | ${title}` });
    }
}

router.get('/home', AuthMiddleware, appRender('Main Page'));
router.get('/stats', AuthMiddleware, appRender('Statistics'));
router.get('/bin', AuthMiddleware, appRender('Recycle Bin'));
router.get('/news', AuthMiddleware, appRender('News'));
router.get('/home/new-note', AuthMiddleware, appRender('New Note'));

module.exports = router;