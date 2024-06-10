import { createServer } from 'node:http';
import ENVIRONMENT_CONFIG from './config/environment.config.js';
import stress from "./utils/stress.js"

const server = createServer((req, res) => {
  try {
    if(req.url === "/stress" && req.method === "GET"){
      //simulating CPU intensive operation
      stress()
      res.setHeader('Content-Type', 'text/plain');
      res.end('oh Maar dala maar dala maar dala');
    }
  } catch (error) {
    console.log(error)
  }
});

server.listen(ENVIRONMENT_CONFIG.APP_PORT, ENVIRONMENT_CONFIG.HOST_NAME, () => {
  console.log(`${process.pid}: Server running at http://${ENVIRONMENT_CONFIG.HOST_NAME}:${ENVIRONMENT_CONFIG.APP_PORT}/`);
});

