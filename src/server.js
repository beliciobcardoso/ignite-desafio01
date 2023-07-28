import http from 'node:http';

const server = http.createServer(async (req, res) => {});

server.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
