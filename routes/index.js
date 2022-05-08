const express = require('express');
const router = express.Router();

//Define Validasi Auth
const authChecker = require('../services/auth_check');

//Define Root Absent History
const routerHistory = require('./absents/history');

//Define Root Izin History
const routerHistoryIzin = require('./izin/history');

//Define API /absent/history
router.use('/absent/history', authChecker.checkAuth, (req, res, next) => {
    next();
}, routerHistory);

//Define API /izin/history
router.use('/izin/history', authChecker.checkAuth, (req, res, next) => {
    next();
}, routerHistoryIzin);


//Sample Route
/**
  * @swagger
  * /:
  *   get:
  *     description: Returns the homepage
  *     responses:
  *       200:
  *         description: hello world
  */
router.get('/', (req, res, next) => {
    res.send({
        message: 'Service Atasan',
        url: req.originalUrl
    })
});
//End Sample

//exports
module.exports = router;