const express = require('express')
const bodyParser = require('body-parser');
const app = express()

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));


function ReturnList() {
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    const http = new XMLHttpRequest();
    const url = 'http://localhost:5000/api/v1/MusicViewerAPI';
    http.open("GET", url, false);
    http.send(null);

    if (http.status === 200) {
        var data = http.responseText;
    }
    else {
        var data = null;
    }
    return data;
}

app.get('/', function (req, res) {   
    var listDisplay = ReturnList();  
    var newlistDisplay = JSON.parse(listDisplay);
    res.render('index', { title: null, file: null, error: null, list: newlistDisplay });
})



const request = require('request');

app.post('/', function (req, res) {
    var search = req.body.search;
    var url2 = `http://localhost:5000/api/v1/MusicViewerAPI_title/${search}`;
    // Search is an int, try and get data by id
    if (search === "1" || search === "2" || search === "3") {
        var url2 = `http://localhost:5000/api/v1/MusicViewerAPI/${search}`;
    } else { 
        var url2 = `http://localhost:5000/api/v1/MusicViewerAPI_title/${search}`;
    }
    console.log(url2);
    request(url2, function (err, response, body) { 
        if (err) {
            res.render('index', {title:null, list:null, error:'Error, please try again' });
        } else {
            let data = JSON.parse(body);
            if (data.success == "false") {
                var listDisplay = ReturnList();
                var newlistDisplay = JSON.parse(listDisplay);
                res.render('index', { title: null, list: null, error: 'Error, please try again', list: newlistDisplay });
            }
            else if (data.MV_API_Data_id.id == undefined) {
                var listDisplay = ReturnList();
                var newlistDisplay = JSON.parse(listDisplay);
                res.render('index', { title: null, list: null, error: 'Error, please try again', list: newlistDisplay });
            } else {
                console.log("Json data is " + data.MV_API_Data_id.title);
                let lyricTitle = `${data.MV_API_Data_id.title}`;
                let lyricFile = `${data.MV_API_Data_id.file}`;
                var listDisplay = ReturnList();
                var newlistDisplay = JSON.parse(listDisplay);
                res.render('index', { title: lyricTitle, file: lyricFile, error:null, list: newlistDisplay});
            }
        }
    });
})

app.listen(3000, function () {
    console.log('PJ Music View Version 1.00 App listening on port 3000!')
})

