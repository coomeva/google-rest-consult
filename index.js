'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const restService = express();

restService.use(bodyParser.urlencoded({
    extended: true
}));

restService.use(bodyParser.json());

restService.post('/echo', function(req, res) {
    
   var number = req.body.result.parameters.echoText;
    
    callConsultAssociate(number).then((resultado) => {
    return res.json({
        speech: resultado,
        displayText: resultado,
        source: 'webhook-echo-sample'
        });
    });
});

restService.post('/music', function(req, res) {
    var speech = "";
    switch (req.body.result.parameters.AudioSample.toLowerCase()) {
        case "music":
            speech = '<speak>  <audio src="https://actions.google.com/sounds/v1/ambiences/barnyard_with_animals.ogg">did not get your MP3 audio file</audio></speak>';
            break;
        case "delay":
            speech = '<speak>Let me take a break for 3 seconds. <break time="3s"/> I am back again.</speak>';
            break;
    }
    return res.json({
        speech: speech,
        displayText: speech,
        source: 'webhook-echo-sample'
    });
});

restService.post('/video', function(req, res) {
    return res.json({
        speech: '<speak>  <audio src="https://www.youtube.com/watch?v=VX7SSnvpj-8">did not get your MP3 audio file</audio></speak>',
        displayText: '<speak>  <audio src="https://www.youtube.com/watch?v=VX7SSnvpj-8">did not get your MP3 audio file</audio></speak>',
        source: 'webhook-echo-sample'
    });
});



restService.post('/slack-test', function(req, res) {

    var slack_message = {
        "text": "Details of JIRA board for Browse and Commerce",
        "attachments": [{
            "title": "JIRA Board",
            "title_link": "http://www.google.com",
            "color": "#36a64f",

            "fields": [{
                "title": "Epic Count",
                "value": "50",
                "short": "false"
            }, {
                "title": "Story Count",
                "value": "40",
                "short": "false"
            }],

            "thumb_url": "https://stiltsoft.com/blog/wp-content/uploads/2016/01/5.jira_.png"
        }, {
            "title": "Story status count",
            "title_link": "http://www.google.com",
            "color": "#f49e42",

            "fields": [{
                "title": "Not started",
                "value": "50",
                "short": "false"
            }, {
                "title": "Development",
                "value": "40",
                "short": "false"
            }, {
                "title": "Development",
                "value": "40",
                "short": "false"
            }, {
                "title": "Development",
                "value": "40",
                "short": "false"
            }]
        }]
    }
    return res.json({
        speech: "speech",
        displayText: "speech",
        source: 'webhook-echo-sample',
        data: {
            "slack": slack_message
        }
    });
});

unction callConsultAssociate(number){
    return new Promise((resolve, reject) => {
        var host = 'ec2-184-73-133-117.compute-1.amazonaws.com';
        var port = '8080';
        var path = '/consultacedula/services/rest/' + number;
        
        console.log('API Request;' + host + port + path);
        
        var options ={
            host: host, 
            port: port, 
            path: path
        };


        http.get(options, (res) =>{
            var body = '';
            res.on('data', (d) => { 
                body += d;
            });
            res.on('end', () => {
                var respone = JSON.parse(body);
                var name = respone.nameClient;
                
                let output = 'welcome bot DialogFlow.' + name;
                console.log('++++' + output);
                resolve(output);
            });
            res.on('error', (error) => {
                reject(error);
            });
        });
    });
}



restService.listen((process.env.PORT || 8000), function() {
    console.log("Server up and listening");
});
