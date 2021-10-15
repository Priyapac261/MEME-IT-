const http = require('http');
  const fs = require('fs');
  const url = require('url');
  
  
  const text = fs.readFileSync("index.html")
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  if(req.url=='/'){
      res.end(text);
  }else if(req.url == '/templates'){
      res.end("Hello world");
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});