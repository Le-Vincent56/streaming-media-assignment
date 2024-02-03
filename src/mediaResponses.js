// Imports
const fs = require('fs');
const path = require('path');

// Server functions
const getMedia = (request, response, fileName, contentType) => {
  const file = path.resolve(__dirname, `../client/${fileName}`);

  // Check the statistics of the file
  fs.stat(file, (err, stats) => {
    // Check for an error
    if (err) {
      // Check for "Error No Entry"
      if (err.code === 'ENOENT') {
        // Write 404 if there's an error
        response.writeHead(404);
      }

      // End the response with the given error
      return response.end(err);
    }

    // Check for a range header
    let { range } = request.headers; // Destructuring assignment from ES6 JavaScript
    if (!range) {
      range = 'bytes=0-';
    }

    // Replace "bytes=" with nothing and split the range into the beginning and end positions
    const positions = range.replace(/bytes=/, '').split('-');

    // Parse the starting position
    let start = parseInt(positions[0], 10);

    // Get the total file size in bytes
    const total = stats.size;

    // If there's a value at positions[1], then parse it, otherwise set it to the total file size
    // minus one
    const end = positions[1] ? parseInt(positions[1], 10) : total - 1;

    // Check if the start range is greater than the end range
    if (start > end) {
      // If so, reset the start range to be smaller
      start = end - 1;
    }

    // Determine how big of a chunk we are sending back to the browser in bytes
    const chunkSize = (end - start) + 1;

    // Write a response - 206 success code (partial content)
    response.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${total}`, // Tell the browsert how much data we are sending out of the total
      'Accept-Ranges': 'bytes', // Tells the browser what type of data to expect the range in
      'Content-Length': chunkSize, // Tells the browser how big this chunk is in bytes
      'Content-Type': contentType, // Tells the browser the type of content to expect
    });

    // Create the file stream
    const stream = fs.createReadStream(file, { start, end });

    // When the file opens, connect the stream to our response using the pipe function
    stream.on('open', () => {
      stream.pipe(response);
    });

    // In the event of an error, end the response and return our stream error -
    // this tells the browser to stop listening for bytes
    stream.on('error', (streamErr) => {
      response.end(streamErr);
    });

    return stream;
  });
};

// Exports
module.exports.getMedia = getMedia;
