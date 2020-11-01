const { spawn } = require('child_process');

const python = spawn('python3', ['-u', './test.py'], {
    stdio: 'pipe',
    cwd: __dirname,
});

python.stdout.on('data', (data) => console.log('received', data.toString()));
python.on('error', console.log);
python.on('close', console.log);
python.stdin.setEncoding('utf-8');

setInterval(() => {
    const data = Math.random().toString();
    console.log('seding', data);
    python.stdin.write(data + '\n');
    // python.stdin.end();
}, 500);
