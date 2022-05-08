const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');

//Read Environment Variables
require('dotenv').config();

//Panggil Path Node
const app_path = require('path');

//Setup Logger
const { setupLogging } = require("./logging");

//Setup API Docs
const { setupDocs } = require("./api_docs");

//Define index Routes
const routerIndex = require('./routes/index');

//Define Port Running
const port = process.env.PORT;


//Create Directory for Logger
const path_logs = app_path.join(__dirname, "logs");

//Create Directory untuk penyimpanan Image
const path_image_in = app_path.join(__dirname, "images/in");
const path_image_out = app_path.join(__dirname, "images/out");
try {
    if (!fs.existsSync(path_logs)) {
        fs.mkdirSync(path_logs, { recursive: true });
    }
    if (!fs.existsSync(path_image_in)) {
        fs.mkdirSync(path_image_in, { recursive: true });
    }
    if (!fs.existsSync(path_image_out)) {
        fs.mkdirSync(path_image_out, { recursive: true });
    }
} catch (err) {
    console.error(err);
}

//Run Docs
setupDocs(app, app_path, port);

//To support JSON-encoded bodies
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        // To support URL-encoded bodies
        extended: true,
    })
);

// Main Routes
app.use('/', routerIndex);

//Run Logger
setupLogging(app, path_logs);

//Handle Routes Tidak Diketahui
app.use((req, res, next) => {
    res.status(404);
    res.send({
        message: 'Page Not Found'
    })
    //File HTML res.sendFile('views/page_not_found.html', {root: __dirname });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})