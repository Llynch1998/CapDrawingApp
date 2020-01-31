const http = require('http');

const port = process.env.PORT || process.env.NODE_PORT || 3000;
const fs = require('fs');

const html = fs.readFileSync(`${__dirname}/../html/draw-and-share-start.html`);

const getHtml = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(html);
  response.end();
};

const onRequest = (request, response) => {
  console.log(request.url);

  switch (request.url) {
    case '/':
      getHtml(request, response);
      break;
    default:
      getHtml(request, response);
      break;
  }
};

http.createServer(onRequest).listen(port);

console.log('listening locally');
