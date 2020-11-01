import { writeFile, mkdir } from 'fs/promises';
import { exec } from 'child-process-promise';
import { spawn } from 'child_process';

import express from 'express';
import expressWs from 'express-ws';

const { app, getWss, applyTo } = expressWs(express());

app.use(express.static('../gui/build'));

const mtracker = spawn(
    'python',
    ['-u', 'track_stdio.py', '-t', 'du', '-m', './models/dense_aug.hdf5'],
    {
        cwd: '../../mtracker.github.io-master',
    }
);

const createName = () => {
    const number = Math.floor(Math.random() * 10000);
    return `file-${number}.jpg`;
};
mtracker.stdout.on('data', console.log);
mtracker.on('error', console.log);
mtracker.on('close', console.log);

app.ws('/socket', function (ws, req) {
    mtracker.stdout.on('data', (data) => {
        console.log('received data', data);
        ws.send(data);
    });
    ws.on('message', async function (buffer: Buffer) {
        console.log('received message of length', buffer.length);
        try {
            await exec('rm -rf ./files');
            await mkdir('./files');
            const fileName = createName();
            await writeFile(`./files/${fileName}`, buffer, {});
            console.log('writing to mtracker');
            mtracker.stdin.write(`${fileName}\n`);
        } catch (e) {
            console.log(e);
        }
    });
});

app.listen(8088);
console.log('listening');
