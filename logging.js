const morgan = require("morgan");
const winston = require('winston');
const fs = require('fs');

const setupLogging = (app, path) => {
    var writeFileStream = fs.createWriteStream(path + '/access.log', { flags: 'a' });
    app.use(morgan('combined', { stream: writeFileStream }));
    
    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        //defaultMeta: { service: 'user-service' },
        transports: [
            //
            // - Write all logs with importance level of `error` or less to `error.log`
            // - Write all logs with importance level of `info` or less to `combined.log`
            //
            new winston.transports.File({ filename: path + '/error.log', level: 'error' }),
            new winston.transports.File({ filename: path + '/combined.log' }),
        ],
    });

    app.use((error, req, res, next) => {
        logger.error({route: req.originalUrl, message: error.message})
        if(process.env.NODE_ENV != 'production'){
            res.json({
                message: error.message,
                detail: error.data,
                route: req.originalUrl
            });
        }else{
            res.json({
                message: error.message
            });
        }
    });

    if (process.env.NODE_ENV !== 'production') {
        logger.add(new winston.transports.Console({
            format: winston.format.simple(),
        }));
    }
}

exports.setupLogging = setupLogging