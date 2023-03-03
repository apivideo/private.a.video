require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const ApiVideoClient = require('@api.video/nodejs-client');

const PORT = process.env.PORT || 3000

http.createServer(async function(req, res) {

  // CREATING A NEW VIDEO OBJECT
  if (req.url === "/video") {
    const client = new ApiVideoClient(({ apiKey: process.env.API_KEY }));
    const privateVideo = await client.videos.create({
      title: "My private video", 
      _public: false,
    });
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({video: privateVideo}));
  }
  // UPDATING THE PRIVATE TOKEN
  else if (req.url.match(/\/video\/([a-zA-Z0-9]+)/)) {
    const id = req.url.split("/")[2];
    const client = new ApiVideoClient(({ apiKey: process.env.API_KEY }));
    const video = await client.videos.get(id)
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({video}));
  }
  // HTML
  else if(req.url === "/") {
    fs.readFile("./public/index.html", "UTF-8", function(err, html){
      res.writeHead(200, {"Content-Type": "text/html"});
      res.end(html);
    });
  } 
  // CSS
  else if(req.url.match("\.css$")) {
    const cssPath = path.join(__dirname, 'public', req.url);
    const fileStream = fs.createReadStream(cssPath, "UTF-8");
    res.writeHead(200, {"Content-Type": "text/css"});
    fileStream.pipe(res);
  } 
  // SVG
  else if(req.url.match("\.svg$")) {
    const imagePath = path.join(__dirname, 'public', req.url);
    const fileStream = fs.createReadStream(imagePath);
    res.writeHead(200, {"Content-Type": "image/svg+xml"});
    fileStream.pipe(res);
  } 
  // PNG
  else if(req.url.match("\.png$")) {
    const imagePath = path.join(__dirname, 'public', req.url);
    const fileStream = fs.createReadStream(imagePath);
    res.writeHead(200, {"Content-Type": "image/png"});
    fileStream.pipe(res);
  } 
  // FAVICON
  else if (req.url.match("\.ico$")) {
    const imagePath = path.join(__dirname, 'public', req.url);
    const fileStream = fs.createReadStream(imagePath);
    res.writeHead(200, {'Content-Type': 'image/x-icon'} );
    fileStream.pipe(res);
  }
  else {
    res.writeHead(404, {"Content-Type": "text/html"});
    res.end("No Page Found");
  }

}).listen(PORT, function() {
  console.log('Server started on port: ' + PORT)
});
