import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-13328.crce206.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 13328,
        family: 4
    }
});

client.on('error', (err) => {
    console.log(err);
});

client.on('connect', () => {
    console.log('connecting.. to Redis');
});

client.on('ready', () => {
    console.log('Connected to Redis');
});

client.connect();

export default client; 