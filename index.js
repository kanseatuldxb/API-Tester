var http = require('http');
const WebSocket = require('ws');
const url = require('url');
const cors = require('cors')
const fs = require('fs')
var qs = require('querystring');
const winston = require('winston');

ServerPort = 4000
ServerName = "Sample Project"
try {
	console.log("Reading Setup.json : " )
	data = fs.readFileSync("./setup.json")
	var SetupInfo = JSON.parse(data);
	console.log("Server Name -> " + SetupInfo.ProjectName )
	console.log("Server Port -> " + SetupInfo.ServerPort )
	ServerPort = SetupInfo.ServerPort
	ServerName = SetupInfo.ProjectName
}
catch(err){
	console.log("Error whilr Reading Setup File" + err)
	console.log("using Default Configuration: " )
}


const logConfiguration = {
    transports: [
        new winston.transports.File({
			filename: 'server.log',
    		format:winston.format.combine(
				winston.format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
				winston.format.align(),
				winston.format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
		)})
    ]
};

const logger = winston.createLogger(logConfiguration);

var server = http.createServer(function (req, res) {
    var urlParts = url.parse(req.url, true),
        urlParams = urlParts.query, 
        urlPathname = urlParts.pathname,
        body = '',
        reqInfo = {};
 
    req.on('data', function (data) {
        body += data; 
    });
 
    req.on('end', function () {
        reqInfo.urlPathname = urlPathname; //sample value: /api/employee
        reqInfo.urlParams = urlParams; //sample value: {"id": "12345","name": "Kay"}
        reqInfo.body = qs.parse(body); //sample value: {"firstname": "Clarkson","lastname": "Nick"}
        reqInfo.urlParts = urlParts;
		var Info = JSON.stringify(reqInfo)
        console.log(reqInfo);
        res.writeHead(200, {'Content-type':'application/json'});
		var data = ""
		try {
			data = JSON.stringify(JSON.parse(fs.readFileSync("."+reqInfo.urlPathname+'.json', 'utf8')))
			logger.info("URL : " + reqInfo.urlPathname);
			logger.info("URL Parameter : " + JSON.stringify(reqInfo.urlParams));
			logger.info("Method : " + req.method);
			logger.info("Header : " + JSON.stringify(req.headers));
			logger.info("Body : " + body);
			logger.info("Response : " +data);

			console.log("URL : " + reqInfo.urlPathname);
			console.log("URL Parameter : " + JSON.stringify(reqInfo.urlParams));
			console.log("Method : " + req.method);
			console.log("Header : " + JSON.stringify(req.headers));
			console.log("Body : " + body);
			console.log("Response : " +data);
		  } catch (err) {
			data = JSON.stringify(JSON.parse(fs.readFileSync("./error.json", 'utf8')))
			logger.error("URL : " + reqInfo.urlPathname);
			logger.error("URL Parameter : " + JSON.stringify(reqInfo.urlParams));
			logger.error("Method : " + req.method);
			logger.error("Header : " + JSON.stringify(req.headers));
			logger.error("Body : " + body);
			logger.error("Response : " +data);
			logger.error("Error : Exception (\"Invalid Endpoint DATA\") -> " + err);

			console.warn("URL : " + reqInfo.urlPathname);
			console.warn("URL Parameter : " + JSON.stringify(reqInfo.urlParams));
			console.warn("Method : " + req.method);
			console.warn("Header : " + JSON.stringify(req.headers));
			console.warn("Body : " + body);
			console.warn("Response : " +data);
			console.warn("Error : Exception (\"Invalid Endpoint DATA\") -> " + err);
		  }
		
		
		
        res.end(data);
    });
 
});
server.listen(ServerPort);
console.log(ServerName +" running at http://localhost:" + ServerPort);
 

		
		

