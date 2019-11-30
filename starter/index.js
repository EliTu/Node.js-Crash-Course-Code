// NODE CORE MODULES:
const fs = require('fs');
const http = require('http');
const url = require('url');

/* FILE SYSTEM */

// readFileSync takes the absolute path to a JSON file, and the char encoding (otherwise it will return "buffer"), this one works synchronously on server init:
const jsonFile = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');

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

	/* ROUTING */

	// Routing different paths by the pathName value:
	switch (pathName) {
		// If the pathName is products or home screen then respond with a 200 and some text:

		case '/products':
		case '/':
			res.writeHead(200, { 'Content-type': 'text/html' });

			// Read the template-overview file asynchronously:
			fs.readFile(
				`${__dirname}/templates/template-overview.html`,
				'utf-8',
				(err, data) => {
					try {
						let overviewOutput = data;
						// After overview is loaded, read the template-card:
						fs.readFile(
							`${__dirname}/templates/template-card.html`,
							'utf-8',
							(err, data) => {
								// Loop over the laptop data in the array and produce a card template for each, then parse it to a string:
								const cards = laptopData
									.map(cardHtml =>
										replaceTemplate(data, cardHtml)
									)
									.join('');

								// Replace the placeholder in the overview with the string cards:
								overviewOutput = overviewOutput.replace(
									'{%CARDS%}',
									cards
								);
								// Output the result to the page:
								res.end(overviewOutput);
							}
						);
					} catch {
						console.log(err);
					}
				}
			);

			break;

		case '/laptop':
			// Make sure the query won't exceed the amount of id's that are available in the file (5):
			if (id < laptopData.length) {
				res.writeHead(200, { 'Content-type': 'text/html' });

				// Read the template file asynchronously:
				fs.readFile(
					`${__dirname}/templates/template-laptop.html`,
					'utf-8',
					(err, data) => {
						try {
							// data gives us access to the readFile result:
							const laptop = laptopData[id];

							// Replace the template placeholders with the real data:
							const laptopPage = replaceTemplate(data, laptop);

							// At the end, send the template html output as the response:
							res.end(laptopPage);
						} catch {
							console.log(err);
							res.end(`Oops! an error has occurred: ${err}`);
						}
					}
				);
			} else {
				res.writeHead(404, { 'Content-type': 'text/html' });
				res.end('PAGE NOT FOUND!');
			}
			break;

		// To serve an image, first test if the pathName ends with jpg/jpeg/png\gif ,then serve that image based on pathName:
		case `${/\.(jpg|jpeg|png|gif)$/i.test(pathName) ? pathName : ''}`:
			if (pathName) {
				fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
					res.writeHead(200, { 'Content-type': 'image/jpg' });
					try {
						res.end(data);
					} catch {
						console.log(err);
					}
				});
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

/* PORT & LISTEN */

// Set a port number, an ip for the server to listen to and an optional callback function:
server.listen(1337, '127.0.0.1', () =>
	console.log('Server is listening for requests')
);

/* UTIL */

// Utility function to replace template html with a new html full of laptop data:
function replaceTemplate(html, laptop) {
	let output = html.replace(/{%PRODUCTNAME%}/g, laptop.productName);
	output = output.replace(/{%IMAGE%}/g, laptop.image);
	output = output.replace(/{%PRICE%}/g, laptop.price);
	output = output.replace(/{%SCREEN%}/g, laptop.screen);
	output = output.replace(/{%CPU%}/g, laptop.cpu);
	output = output.replace(/{%STORAGE%}/g, laptop.storage);
	output = output.replace(/{%RAM%}/g, laptop.ram);
	output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
	output = output.replace(/{%ID%}/g, laptop.id);
	return output;
}
