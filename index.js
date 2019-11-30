// NODE CORE MODULES:
const fs = require('fs');
const http = require('http');
const url = require('url');

/* FILE SYSTEM */

// readFileSync takes the absolute path to a JSON file, and the char encoding (otherwise it will return "buffer"), this one works synchronously on server init:
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
	const pathName = url.parse(req.url, true).pathname;

	// Parse the query in the URL:
	const query = url.parse(req.url, true).query;

	// Get the id parameter from the query:
	const id = query.id;

	/* Routing */
	// Routing different paths by the pathName value:
	switch (pathName) {
		// If the pathName is products or home screen then respond with a 200 and some text:
		case '/products':
		case '/':
			res.writeHead(200, { 'Content-type': 'text/html' });
			res.end('PRODUCTS!');
			break;

		case '/laptop':
			// Make sure the query won't exceed the amount of id's that are available in the file (5):
			if (id < laptopData.length) {
				res.writeHead(200, { 'Content-type': 'text/html' });
				// Indicate the number of the id by the id passed in the query:
				// res.end(`Laptop #${id}`);

				// Read the template file asynchronously:
				fs.readFile(
					`${__dirname}/templates/template-laptop.html`,
					'utf-8',
					(err, data) => {
						try {
							// data gives us access to the readFile result:
							const laptop = laptopData[id];
							// Replace the template placeholders with the real data:
							let output = data.replace(
								/{%PRODUCTNAME%}/g,
								laptop.productName
							);
							output = output.replace(/{%IMAGE%}/g, laptop.image);
							output = output.replace(/{%PRICE%}/g, laptop.price);
							output = output.replace(
								/{%SCREEN%}/g,
								laptop.screen
							);
							output = output.replace(/{%CPU%}/g, laptop.cpu);
							output = output.replace(
								/{%STORAGE%}/g,
								laptop.storage
							);
							output = output.replace(/{%RAM%}/g, laptop.ram);
							output = output.replace(
								/{%DESCRIPTION%}/g,
								laptop.description
							);
							// At the end, send the template html output as the response:
							res.end(output);
						} catch {
							console.log(err);
							res.end(`Oops! an error has occurred: ${er}`);
						}
					}
				);
			} else {
				res.writeHead(404, { 'Content-type': 'text/html' });
				res.end('PAGE NOT FOUND!');
			}
			break;

		// If the path does not match pathName then respond with a 404:
		default:
			res.writeHead(404, { 'Content-type': 'text/html' });
			res.end('PAGE NOT FOUND!');
			break;
	}
	/* RESPONSE */

	// writeHead method on the response object allows us to set up a response header with the status code and the options object:
	// res.writeHead(200, { 'Content-type': 'text/html' });

	// end method on the response object that is the final response:
	// res.end('This is the response');
});

// Set a port number, an ip for the server to listen to and an optional callback function:
server.listen(1337, '127.0.0.1', () =>
	console.log('Server is listening for requests')
);
