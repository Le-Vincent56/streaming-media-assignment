// Imports
const http = require('http');
const htmlHandler = require('./htmlResponses.js');
const mediaHandler = require('./mediaResponses.js');

// Establish port
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Server functions
const onRequest = (request, response) => {
  console.log(request.url);

  switch (request.url) {
    // Base case - get client.html
    case '/':
      htmlHandler.getIndex(request, response);
      break;

      // Get party.mp4
    case '/party.mp4':
      mediaHandler.getMedia(request, response, 'party.mp4', 'video/mp4');
      break;

      // Get client2.html
    case '/page2':
      htmlHandler.getPage(request, response, 'client2.html');
      break;

      // Get bling.mp3
    case '/bling.mp3':
      mediaHandler.getMedia(request, response, 'bling.mp3', 'audio/mpeg');
      break;

      // Get client3.html
    case '/page3':
      htmlHandler.getPage(request, response, 'client3.html');
      break;

      // Get bird.mp4
    case '/bird.mp4':
      mediaHandler.getMedia(request, response, 'bird.mp4', 'video/mp4');
      break;

      // Default case - get client.html
    default:
      htmlHandler.getIndex(request, response);
      break;
  }
};

// Create the server
http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});
