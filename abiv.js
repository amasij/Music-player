const nodeAbi=require('node-abi')
console.log("node: "+nodeAbi.getAbi("8.9.4","node"));
console.log("electron: "+nodeAbi.getAbi("5.0.1","electron"));