import express from 'express';
import bodyParser from 'body-parser';

// Vars
var DEBUG = false;
const PORT = 5000;
const Add_Data_API_Post = '/api/v1/MusicViewerAPI';
const Get_ALL_Data_API_Call = '/api/v1/MusicViewerAPI';
const Save_ALL_Data_Call = '/api/v1/MusicViewerAPI/save';
const Get_Data_By_ID = '/api/v1/MusicViewerAPI/:id';
const Get_Data_Like_Title = '/api/v1/MusicViewerAPI_title/:title';
const db_source = './db/test2.json';

// Load db file
var fs = require('fs');
var data = fs.readFileSync(db_source);
var MV_API = JSON.parse(data);

// Check for Debug mode
if (DEBUG) {
    console.log(MV_API);
}

// Set up the express app
const app = express();

//Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Post some new data
app.post(Add_Data_API_Post, (req, res) => {
    if (!req.body.title) {
        return res.status(400).send({
            success: 'false',
            message: 'title is required'
        });
    } else if (!req.body.description) {
        return res.status(400).send({
            success: 'false',
            message: 'description is required'
        });
    }
    const MV_API_Data = {
        id: MV_API.length + 1,
        title: req.body.title,
        description: req.body.description
    }
    MV_API.push(MV_API_Data);
    return res.status(201).send({
        success: 'true',
        message: 'data added successfully',
        MV_API_Data
    })

    console.log(MV_API);

});

// get all Music Data API Call
app.get(Get_ALL_Data_API_Call, (req, res) => {
    res.status(200).send({
        success: 'true',
        message: 'MV_API retrieved successfully',
        MusicFile: MV_API
    })
});

// Save to Json API Call
app.get(Save_ALL_Data_Call, (req, res) => {

    var json = JSON.stringify(MV_API);
    const fs = require('fs');
    fs.writeFile(db_source, json, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
    res.status(200).send({
        success: 'true',
        message: 'MV_API saved data..',
        MusicFile: MV_API
    })

});

// Retrieve by ID
app.get(Get_Data_By_ID, (req, res) => {

    const id = parseInt(req.params.id, 10);
    if (DEBUG) {
        console.log(id);
    }

    MV_API.map((MV_API_Data_id) => {

        if (MV_API_Data_id.id === id) {

            return res.status(200).send({
                MV_API_Data_id,
            });

        }


    });
    return res.status(404).send({

        success: 'false',
        message: 'data does not exist',

    });

});

 // Retrieve like title
app.get(Get_Data_Like_Title, (req, res) => {

    const title = req.params.title;
    if (DEBUG) {
        console.log("In like Method" + title);
    }

    MV_API.map((MV_API_Data_id) => {
        //Make a check bolean if there's a like match
        var check = MV_API_Data_id.title.includes(title);
        console.log("Inside like and the match was " + check + " The varible passed in was " + MV_API_Data_id.title );
        if (MV_API_Data_id.title === title || check) {
            return res.status(200).send({
                MV_API_Data_id,
            });

        }

    });
    return res.status(404).send({

        success: 'false',
        message: 'data does not exist',

    });

});

// Start API Listner

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});