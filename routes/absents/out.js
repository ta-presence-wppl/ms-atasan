const express = require('express');
const router = express.Router();
var fs = require('fs');

//Define Async
const async = require('async');

//Panggil Path Node
const path = require('path');

//Define Controllers
const AbsentControllers = require('../../controllers/absent');

//Define Validator Body
const validator = require('./authValidator');

//Define Multer Untuk File Upload
const multer = require('multer');
var moment = require('moment'); // require

//Define Multer Images Folder
const imageStorage = multer.diskStorage({
    // Destination to store image     
    destination: 'images/out',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-out-' + Date.now()
            + path.extname(file.originalname))
        // file.fieldname is name of the field (image)
        // path.extname get the uploaded file extension
    }
});

//Define Image Upload
const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            // upload only png and jpg format
            return cb(new Error('Please upload a Image'))
        }
        cb(undefined, true)
    }
})

//Sample Route
/**
 * @swagger
 * /auth:
 *   post:
 *     description: Auth User
 *     responses:
 *       200:
 *          description: Returns one User Specified.
 *          data: Some data user
 *          token: Return token to Verified User
 *     body:
 *          - email
 *          - password
 */
router.get('/', (req, res, next) => {
    res.json({
        message: 'Sukses GET Absen OUT'
    })
});

router.post('/', imageUpload.single('image'), (req, res, next) => {
    var myDate = {
        id_peg: req.user_data.id_peg,
        time: moment().format('kk:mm:ssZ'),
        date: moment().format('YYYY-MM-D'),
        lokasi_plg: req.body.lokasi_plg,
        foto_plg: req.file.filename
    }
    try {
        async.waterfall([
            (callback) => {
                new AbsentControllers().checkAbsentOut(myDate).then(x => {
                    if (x) {
                        callback(null, x);
                    } else {
                        try {
                            fs.unlink(path.join(__dirname + '../../../images/out/') + req.file.filename, function () {
                                res.status(406).send({
                                    message: 'Anda Belum Melakukan Absen Kedatangan atau Telah Absen Pulang!'
                                })
                            });
                        } catch (error) {
                            res.status(500).send({ error: error.message })
                        }
                    }
                }).catch(err => {
                    var details = {
                        parent: err.parent,
                        name: err.name,
                        message: err.message
                    }
                    var error = new Error("Error pada server");
                    error.status = 500;
                    error.data = {
                        date: new Date(),
                        route: req.originalUrl,
                        details: details
                    };
                    next(error);
                });
            },
            (checkAbsent, callback) => {
                new AbsentControllers().updateAbsentIn(myDate).then(x => {
                    res.send({
                        message: 'Sukses POST Absen OUT'
                    })
                }).catch(err => {
                    var details = {
                        parent: err.parent,
                        name: err.name,
                        message: err.message
                    }
                    var error = new Error("Error pada server");
                    error.status = 500;
                    error.data = {
                        date: new Date(),
                        route: req.originalUrl,
                        details: details
                    };
                    next(error);
                });
            }
        ]);
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}, (error, req, res, next) => {
    res.status(500).send({ error: error.message })
});

//exports
module.exports = router;