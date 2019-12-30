const { Router } = require('express');
const router = Router();
const authMiddleware = require('../../libs/auth.middleware');

router.get('/home', authMiddleware, (req, res) => {
    res.render('home/index', {title: 'Reactive Notes | Main Page'});
});
router.get('/stats', authMiddleware, (req, res) => {
    res.render('home/index', {title: 'Reactive Notes | Statistics'});
});
router.get('/bin', authMiddleware, (req, res) => {
    res.render('home/index', {title: 'Reactive Notes | Reclycle Bin'});
});
router.get('/news', authMiddleware, (req, res) => {
    res.render('home/index', {title: 'Reactive Notes | News'});
});
router.get('/home/new-note', authMiddleware, (req, res) => {
    res.render('home/index', {title: 'Reactive Notes | New Note'});
});

module.exports = router;