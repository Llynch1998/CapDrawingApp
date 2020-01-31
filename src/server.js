console.log("hi");

var http = require('http');
var fs = require('fs');

const port = process.env.PORT || process.end.NODE_PORT || 3000;


fs.readFile('./draw-and-share-start.html', function (err, html){
    if (err){
        throw err;
    }

    http.createServer(function (err, html){
        response.writeHeader(200, {"Content-Type": "text/html"});
        response.write(html);
        response.end();

    }).listen(port);
});
