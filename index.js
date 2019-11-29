// NODE CORE MODULES:
const fs = require('fs');
const http = require('http');

/* Fetching system files and parsing */

// readFileSync takes the absolute path to a JSON file, and the char encoding (otherwise it will return "buffer"):
const jsonFile = fs.readFileSync(
	`${__dirname}/starter/data/data.json`,
	'utf-8'
);

// Parse the JSON object into a JS object:
const laptopData = JSON.parse(jsonFile);

/* Creating a server */

// Run the createServer against the http module:
const server = http.createServer();