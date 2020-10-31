import { readFile, writeFile, mkdir } from 'fs/promises';
import { exec } from 'child-process-promise';

import express from 'express';
import expressWs from 'express-ws';

const { app, getWss, applyTo } = expressWs(express());

app.use(express.static('../gui/build'));

app.ws('/socket', function (ws, req) {
    ws.on('message', async function (buffer: Buffer) {
        try {
            await exec('rm -rf ./files');
            await mkdir('./files');
            const fileName = './files/in.jpg';
            await writeFile(fileName, buffer, {});
            await exec(
                'python track_frames.py -i ../server/files/ -t du -m ./models/dense_aug.hdf5 -o ../server/files/out.csv -f ./demo -n 5',
                { cwd: '../mtracker.github.io-master' }
            );
            const data = await readFile('./files/out.csv');
            ws.send(data.toString());
        } catch (e) {
            console.log(e);
        }
    });
});

app.listen(8088);
console.log('listeninng');
