// Servidor Websocket e executador de comandos para o terminal web com o pty.
import { WebSocketServer } from 'ws';
import * as pty from 'node-pty';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
    const shell = 'bash';
    const ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-256color',
        cols: 80,
        rows: 30,
        cwd: process.env.HOME,
        env: { ...process.env, 
            TERM: 'xterm-256color', 
            COLORTERM: 'truecolor'
        } as { [key: string]: string },
    });

    ptyProcess.onData((data) => {
        ws.send(data.toString());
    });
    
    ws.on('message', (message) => {
        ptyProcess.write(message.toString());
    });
});