import redis from 'redis';

const client = redis.createClient()
  .on('error', (err) => {
    console.log(`Redis client not connected to the server: ${err}`);
  })
  .on('ready', () => {
    console.log('Redis client connected to the server');
  })
  .on('message', (channel, message) => {
    if (message == 'KILL_SERVER') {
      client.unsubscribe('holberton school channel');
      client.quit();
    }
    console.log(message);
  });

client.subscribe('holberton school channel');
