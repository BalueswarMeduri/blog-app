import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: 'pC251sGHMIt0VlDsUPEq6Tf8VfpKAzF1',
    socket: {
        host: 'redis-16825.crce179.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 16825
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