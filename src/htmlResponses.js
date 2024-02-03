// Imports
const fs = require('fs');

// Get the client.html
const index = fs.readFileSync(`${__dirname}/../client/client.html`);

// Server functions
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getPage = (request, response, pageName) => {
  const page = fs.readFileSync(`${__dirname}/../client/${pageName}`);

  // Respond with the content
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(page);
  return response.end();
};

// Exports
module.exports.getIndex = getIndex;
module.exports.getPage = getPage;
