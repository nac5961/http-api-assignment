// Requires
const http = require('http');
const url = require('url');
const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Handler to associate specific functions with specific URLs
const urlHandler = {
  '/': responseHandler.sendIndex,
  '/style.css': responseHandler.sendCSS,
  '/success': responseHandler.sendSuccess,
  '/badRequest': responseHandler.sendBadRequest,
  '/unauthorized': responseHandler.sendUnauthorized,
  '/forbidden': responseHandler.sendForbidden,
  '/internal': responseHandler.sendInternal,
  '/notImplemented': responseHandler.sendNotImplemented,
  defaultResponse: responseHandler.sendNotFound,
};

// Process requests to the server
const onRequest = (request, response) => {
  // Parse the URL
  const parsedURL = url.parse(request.url);

  // Get a list of the accepted types
  const types = request.headers.accept.split(',');

  // DEBUG - Look at info for parsedURL and accepted types
  console.dir(parsedURL);
  console.dir(types);

  // Go to request page if found
  if (urlHandler[parsedURL.pathname]) {
    urlHandler[parsedURL.pathname](request, response, types, parsedURL.query);
  } else {
    urlHandler.defaultResponse(request, response, types);
  }
};

// Start the server
http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
