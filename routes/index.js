const express = require('express');
const router = express.Router();

//Define Validasi Auth
const authChecker = require('../services/auth_check');

//Define Root Absent Out
const routerHistory = require('./absents/history');

//Define API /absent/status
router.use('/absent/history', authChecker.checkAuth, (req, res, next) => {
    next();
}, routerHistory);

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