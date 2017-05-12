'use strict';

const cluster = require('cluster');

if (cluster.isMaster) {
    cluster.fork();

    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    require('./index');
}
