import { promisify } from 'util';
import redis from "redis";

const client = redis.createClient()
  .on('error', (err) => {
    console.log(`Redis client not connected to the server:${err}`);
  })
  .on('ready', () => {
    console.log('Redis client connected to the server');
  });

function setNewSchool(schoolName, value) {
  client.set(schoolName, value, redis.print);
};

const getAsync = promisify(client.get).bind(client);

async function displaySchoolValue(schoolName) {
  try {
    const data = await getAsync(schoolName);
    console.log(data);
  } catch (err) {}
};

async function main() {
  await displaySchoolValue('Holberton');
  setNewSchool('HolbertonSanFrancisco', '100');
  await displaySchoolValue('HolbertonSanFrancisco');  
}
main();
