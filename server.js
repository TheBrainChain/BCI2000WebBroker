

import { spawn, execSync } from 'child_process'
import { Telnet } from "telnet-client";
import { WebSocketServer } from 'ws';

const sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

const BCI2000_OPERATOR_LOCATION = 'C:\\Users\\Chris\\Desktop\\bci2000web\\prog\\'


const wss = new WebSocketServer({ port: 80 });
const connection = new Telnet();

const operator = spawn(`${BCI2000_OPERATOR_LOCATION}\\Operator.exe`, [
    "--Telnet",
    "*:3999",
    "--StartupIdle",
], {
    cwd: BCI2000_OPERATOR_LOCATION
});
operator.on("close", () => {
    wss.close()
})

operator.on('spawn', async () => {
    try {
        // We have to wait for BCI2000 to open and be ready to accept a telnet connection
        await sleep(4000)
        await connection.connect({
            host: "127.0.0.1",
            port: 3999,
            timeout: 4000,
            shellPrompt: ">",
            echoLines: 0,
        });

    } catch (error) {
        console.error(error);
    }
})

wss.on('connection', (ws) => {
    ws.on('message', async function message(message) {
        const msg = JSON.parse(message.toString());
        if (msg.opcode == "E") {
            try {
                const response = await connection.exec(msg.contents);
                if (response.length > 0) {
                    ws.send(JSON.stringify({
                        opcode: "O",
                        id: msg.id,
                        contents: response.trim(),
                    }));
                }
            } catch (err) {
                console.error(err);
            }
        }
    });
});