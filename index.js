// NODE CORE MODULES:
const fs = require('fs');
const http = require('http');
const url = require('url');

/* FILE SYSTEM */

// readFileSync takes the absolute path to a JSON file, and the char encoding (otherwise it will return "buffer"):
const jsonFile = fs.readFileSync(
	`${__dirname}/starter/data/data.json`,
	'utf-8'
);

// Parse the JSON object into a JS object:
const laptopData = JSON.parse(jsonFile);

/* SERVER */

// Run the createServer against the http module:
// Add a callback function that takes a request and a response object arguments, that is will run anytime we access the server:
const server = http.createServer((req, res) => {
	/* REQUEST */

	// Parsing the URL of the request object, add true to specify that the query will parsed to an object:
	const query = url.parse(req.url, true);

	console.log(query);
	/* RESPONSE */

	// writeHead method on the response object allows us to set up a response header with the status code and the options object:
	res.writeHead(200, { 'Content-type': 'text/html' });

	// end method on the response object that is the final response:
	res.end('This is the response');
});

// Set a port number, an ip for the server to listen to and an optional callback function:
server.listen(1337, '127.0.0.1', () =>
	console.log('Server is listening for requests')
);

/* Routing */
