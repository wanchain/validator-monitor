const Web3 = require('web3');
const net = require('net');
const config = require('../config');
const BigNumber = require('bignumber.js');

const web3 = new Web3(new Web3.providers.IpcProvider(config.gwan.ipcPath, net));

exports.getLatestBlock = async function() {
  try {
    let block = await web3.eth.getBlock("latest");
    let cur = Math.floor(new Date().getTime() / 1000);
    let age = cur - block.timestamp;
    return {number: block.number, age: age};
  } catch (err) {
    console.error(err);
    return null;
  }
}

exports.getBalance = async function() {
  try {
    let address = await web3.eth.getCoinbase();
    let balance = new BigNumber(await web3.eth.getBalance(address.toLowerCase()));
    return {address: address, balance: balance.div(Math.pow(10, 18))};
  } catch (err) {
    console.error(err);
    return null;
  }
}

exports.closeWeb3 = function() {
  // web3 has not yet provided a way to disconnect
  process.exit(0);
}
