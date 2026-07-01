const { spawn } = require('child_process');
const path = require('path');

console.log('----------------------------------------------------');
console.log('Starting Lakhnavi Sewa Marketplace Prototype...');
console.log('Frontend Host: http://localhost:3000');
console.log('Backend Host:  http://localhost:5000');
console.log('----------------------------------------------------');

// Spawn Express backend
const serverProcess = spawn('npm.cmd', ['run', 'dev'], {
  cwd: path.join(__dirname, 'apps', 'server'),
  stdio: 'inherit',
  shell: true
});

// Spawn Next.js frontend
const webProcess = spawn('npm.cmd', ['run', 'dev'], {
  cwd: path.join(__dirname, 'apps', 'web'),
  stdio: 'inherit',
  shell: true
});

process.on('SIGINT', () => {
  serverProcess.kill();
  webProcess.kill();
  process.exit();
});
process.on('exit', () => {
  serverProcess.kill();
  webProcess.kill();
});
