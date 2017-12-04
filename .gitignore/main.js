'use strict';

var http = require('http');
var express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request');

app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))


app.post('/apis', function(req, response){
 
 var id_number = req.result.parameters.number;

 callConsultAssociate(id_number).then((resultado) => {
        console.log('welcome ' + resultado);
        return response.json({
        speech: resultado,
        displayText: resultado,
        
      });
    });


});

function callConsultAssociate(id_number){
    return new Promise((resolve, reject) => {
        var port = '8080';
        var path = '/consultacedula/services/rest/' + id_number;
        
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


app.listen(2017, function(){
    console.log('servidor iniciado en https://localhost:' + this.address().port);
});
