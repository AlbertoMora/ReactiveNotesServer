const { Router } = require('express');
const router = Router();

router.get('/home', (req,res,next) => next(), (req, res) => {
    res.render('home/index', {title: 'Reactive Notes | Main Page'});
});
router.get('/stats', (req,res,next) => next(), (req, res) => {
    res.render('home/index', {title: 'Reactive Notes | Statistics'});
});
router.get('/bin', (req,res,next) => next(), (req, res) => {
    res.render('home/index', {title: 'Reactive Notes | Reclycle Bin'});
});
router.get('/news', (req,res,next) => next(), (req, res) => {
    res.render('home/index', {title: 'Reactive Notes | News'});
});
router.get('/home/new-note', (req,res,next) => next(), (req, res) => {
    res.render('home/index', {title: 'Reactive Notes | New Note'});
});

module.exports = router;