// Quick Redis connection check
const net = require('net');

const client = new net.Socket();
const REDIS_HOST = 'localhost';
const REDIS_PORT = 6379;

client.setTimeout(2000);

client.on('connect', () => {
  console.log('✅ Redis is running on port 6379');
  client.destroy();
  process.exit(0);
});

client.on('timeout', () => {
  console.log('❌ Redis is NOT running');
  console.log('');
  console.log('To start Redis:');
  console.log('  Option 1 (Docker): docker run -d -p 6379:6379 redis:alpine');
  console.log('  Option 2 (Local):  redis-server');
  console.log('  Option 3 (Skip):   Comment out "import ./queues/ai.worker" in src/app.ts');
  client.destroy();
  process.exit(1);
});

client.on('error', (err) => {
  console.log('❌ Redis is NOT running');
  console.log('');
  console.log('To start Redis:');
  console.log('  Option 1 (Docker): docker run -d -p 6379:6379 redis:alpine');
  console.log('  Option 2 (Local):  redis-server');
  console.log('  Option 3 (Skip):   Comment out "import ./queues/ai.worker" in src/app.ts');
  client.destroy();
  process.exit(1);
});

console.log('Checking Redis connection...');
client.connect(REDIS_PORT, REDIS_HOST);
