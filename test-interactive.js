// Quick test to verify interactive mode loads
const { spawn } = require('child_process');

const child = spawn('node', ['dist/index.js'], {
  cwd: __dirname,
  stdio: 'pipe'
});

let output = '';

child.stdout.on('data', (data) => {
  output += data.toString();
});

child.stderr.on('data', (data) => {
  console.error('Error:', data.toString());
});

setTimeout(() => {
  child.kill();
  
  if (output.includes('Interactive Mode') || output.includes('Search markets:')) {
    console.log('✓ Interactive mode started successfully!');
    console.log('\nOutput preview:');
    console.log(output.substring(0, 500));
  } else {
    console.log('✗ Interactive mode failed to start');
    console.log('Output:', output);
  }
  
  process.exit(0);
}, 2000);
