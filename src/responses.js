// Requires
const fs = require('fs');

// Load files into memory
const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

// Function to build the XML or JSON response
const buildContent = (responseContent, type) => {
  let content = '';

  // Build an XML response
  if (type === 'text/xml') {
    content = `${content} <response>`;
    content = `${content} <message>${responseContent.message}</message>`;

    if (responseContent.id) {
      content = `${content} <id>${responseContent.id}</id>`;
    }

    content = `${content} </response>`;
  } else {
    // Build a JSON response (default response)
    content = JSON.stringify(responseContent);
  }

  return content;
};

// Function to send a server response from a given status code, content and content-type
const sendResponse = (request, response, code, content, type) => {
  response.writeHead(code, { 'Content-Type': type });
  response.write(content);
  response.end();
};

// Function to send the index page in the response
const sendIndex = (request, response) => sendResponse(request, response, 200, index, 'text/html');

// Function to send the CSS in the response
const sendCSS = (request, response) => sendResponse(request, response, 200, css, 'text/css');

// Function to send status code pages
const sendStatusCode = (request, response, types, responseContent, code) => {
  let type = '';

  // Get the type being requested
  if (types[0] === 'text/xml') type = 'text/xml';
  else type = 'application/json';

  // Build the XML or Convert the JSON to a string based on the type
  const content = buildContent(responseContent, type);

  // Send the response
  sendResponse(request, response, code, content, type);
};

// Function to send the success page
const sendSuccess = (request, response, types) => {
  // Create the JSON/XML response
  const responseContent = {
    message: 'This is a successful response',
  };

  sendStatusCode(request, response, types, responseContent, 200);
};

// Function to send the bad request page
const sendBadRequest = (request, response, types, query) => {
  let responseContent = {};
  let code = 0;

  // Check to see if the correct parameter is given
  if (query && query.includes('valid=true')) {
    // Set the correct response and status code
    code = 200;
    responseContent = {
      message: 'This request has the required parameters',
    };
  } else {
    // Set the correct response and status code
    code = 400;
    responseContent = {
      id: 'badRequest',
      message: 'Missing valid query parameter set to true',
    };
  }

  sendStatusCode(request, response, types, responseContent, code);
};

// Function to send the unauthorized page
const sendUnauthorized = (request, response, types, query) => {
  let responseContent = {};
  let code = 0;

  // Check to see if the correct parameter is given
  if (query && query.includes('loggedIn=yes')) {
    // Set the correct response and status code
    code = 200;
    responseContent = {
      message: 'You have successfully viewed the content.',
    };
  } else {
    // Set the correct response and status code
    code = 401;
    responseContent = {
      id: 'unauthorized',
      message: 'Missing loggedIn query parameter set to yes',
    };
  }

  sendStatusCode(request, response, types, responseContent, code);
};

// Function to send the forbidden page
const sendForbidden = (request, response, types) => {
  // Create the JSON/XML response
  const responseContent = {
    id: 'forbidden',
    message: 'You do not have access to this content.',
  };

  sendStatusCode(request, response, types, responseContent, 403);
};

// Function to send the internal page
const sendInternal = (request, response, types) => {
  // Create the JSON/XML response
  const responseContent = {
    id: 'internalError',
    message: 'Internal Server Error. Something went wrong',
  };

  sendStatusCode(request, response, types, responseContent, 500);
};

// Function to send the notImplemented page
const sendNotImplemented = (request, response, types) => {
  // Create the JSON/XML response
  const responseContent = {
    id: 'notImplemented',
    message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
  };

  sendStatusCode(request, response, types, responseContent, 501);
};

// Function to send the notFound page
const sendNotFound = (request, response, types) => {
  // Create the JSON/XML response
  const responseContent = {
    id: 'notFound',
    message: 'The page you are looking for was not found.',
  };

  sendStatusCode(request, response, types, responseContent, 404);
};

// Export the functions (make them public)
module.exports.sendIndex = sendIndex;
module.exports.sendCSS = sendCSS;
module.exports.sendSuccess = sendSuccess;
module.exports.sendBadRequest = sendBadRequest;
module.exports.sendUnauthorized = sendUnauthorized;
module.exports.sendForbidden = sendForbidden;
module.exports.sendInternal = sendInternal;
module.exports.sendNotImplemented = sendNotImplemented;
module.exports.sendNotFound = sendNotFound;
