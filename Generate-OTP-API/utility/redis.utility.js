const redis = require('redis');
const {redisHost, redisPort} = require('../config/config');
const {infoLogger, errorLogger} = require('../logger/logger');
const errors = require('../errors/errors')

let client;


(async function (){
    client = redis.createClient({
        password: 'n5gPpYfCJHONk7iR2ZMkH1O5394AIjcP',
        socket: {
            host: redisHost,
            port: redisPort
        }
    });

    client.on('error', (error) => {
        console.log(error)
        errorLogger(undefined, undefined, `Redis error: ${error.message}`, error);
    });

    client.on('connect', () => {
        infoLogger(undefined, undefined, 'Connected to Redis server');
    });

    await client.connect();
})();

async function setKey(key, value, expiry){
    if (typeof value != 'string'){
        value = String(value)
    }
    try{
        await client.set(key, value, {
            EX: expiry
        });
        return {error: false, message: "Key inserted successfully"}
    }
    catch(error){
        errorLogger(undefined, undefined, `Redis error: ${error.message}`, error);
        return {error: true, message: errors['001'].message, code: '001'}
    }
}

async function getKey(key){
    try{
        const value = await client.get(key);
        return {error: false, message: "Value fetched successfully", data: value}
    }
    catch(error){
        errorLogger(undefined, undefined, `Redis error: ${error.message}`, error);
        return {error: true, message: errors['002'].message, code: '002'}
    }
}


async function getTTL(key){
    try{
        const value = await client.ttl(key);
        return {error: false, message: "TTL fetched successfully", data: value}
    }
    catch(error){
        errorLogger(undefined, undefined, `Redis error: ${error.message}`, error);
        return {error: true, message: errors['003'].message, code: '003'}
    }
}

module.exports = {
    setKey,
    getKey,
    getTTL
}