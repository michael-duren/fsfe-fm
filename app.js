const http = require('http');

http.createServer( function(req, res) {
	res.write("On the way to beinga  full stack engineer");
	res.end();
}
).listen(3000);

console.log(`Server listening on 3000`);
