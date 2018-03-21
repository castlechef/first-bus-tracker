"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const PORT_NUMBER = 8080;
function startServer(port) {
    return new Promise((resolve, reject) => {
        const server = app_1.app.listen(port, () => {
            console.log(`Http server running on port ${port}.`);
            resolve();
        });
        server.on('error', reject);
    });
}
async function start() {
    try {
        await startServer(PORT_NUMBER);
        console.log('Server started successfully.');
    }
    catch (e) {
        if (e.errno === 'EADDRINUSE') {
            console.error(`Port ${PORT_NUMBER} is already in use. Perhaps the server is already running?`);
            process.exit(1);
        }
        else {
            throw e;
        }
    }
}
start();
//# sourceMappingURL=server.js.map