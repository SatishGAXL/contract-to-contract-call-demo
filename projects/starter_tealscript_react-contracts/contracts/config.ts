import { config } from 'dotenv';
config({path: __dirname + `/../.env`});

console.log(process.env.ALGOD_PORT);
console.log(process.env.ALGOD_URL); 

if(!process.env.ALGOD_PORT || !process.env.ALGOD_URL || !process.env.ALGOD_TOKEN || !process.env.WALLET_MNEMONIC) {
  throw new Error('Missing environment variables. Please make sure to create a .env file in the root directory of the project and add the following variables: ALGOD_PORT, ALGOD_URL, ALGOD_TOKEN, WALLET_MNEMONIC')
}

export const ALGOD_PORT = Number(process.env.ALGOD_PORT)
export const ALGOD_URL = process.env.ALGOD_URL
export const ALGOD_TOKEN = process.env.ALGOD_TOKEN
export const WALLET_MNEMONIC = process.env.WALLET_MNEMONIC