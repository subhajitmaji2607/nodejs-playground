import { createServer } from 'node:http';
import cluster from 'node:cluster';
import os from 'node:os';
import ENVIRONMENT_CONFIG from './config/environment.config.js';
import stress from "./utils/stress.js"

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Master process ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker process ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  const server = createServer((req, res) => {
    if(req.url === "/stress" && req.method === "GET"){
      //simulating CPU intensive operation
      stress()
      res.setHeader('Content-Type', 'text/plain');
      res.end(`bach gaya`);
    }
  });
  
  server.listen(ENVIRONMENT_CONFIG.CLUSTER_APP_PORT, ENVIRONMENT_CONFIG.HOST_NAME, () => {
    console.log(`${process.pid}: Server[cluster] running at http://${ENVIRONMENT_CONFIG.HOST_NAME}:${ENVIRONMENT_CONFIG.CLUSTER_APP_PORT}/`);
  });
}

