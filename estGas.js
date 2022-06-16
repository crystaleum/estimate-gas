
const Web3 = require('web3');
const web3 = new Web3('https://evm.cryptocurrencydevs.org');

// VARIABLES
// Set recipient address and transfer value first.
let from_address = '0xB9F96789D98407B1b98005Ed53e8D8824D42A756';
let to_address = '0x6690004E7F83AbEF341dD0DBD326CC55Ba9F1075';
let decimals = 18;
let convert_precision = (10**decimals);
let transfer_amount = 100;
// FUNCTION
// function to estimate gas for next transfer()
async function estimateTransactionGas(){
let amount = transfer_amount * convert_precision;
let amount_to_wei = web3.utils.toWei(amount.toString(), 'ether');
// // function signature: first 4 bytes of the sha3 hash
let function_signature = web3.utils.sha3('transfer(address,uint256)').substring(0,10)
// // we have to make the address field 32 bytes
let address_param = '0'.repeat(24)+to_address.substring(2)
// // likewise, we have to make the transfer value 32 bytes
let transfer_value_param = web3.utils.toHex(web3.utils.toBN(amount_to_wei))
let transfer_value_prefix = '0'.repeat((66 - transfer_value_param.length))
// // combine function signature, and all the arguments
let transfer_data = function_signature + address_param + transfer_value_prefix + transfer_value_param.substring(2)
// Estimate gas
var esGas;
// gas price (in wei)
var gasPrice;
// get nonce
var nonce = await web3.eth.getTransactionCount(
    from_address,
    "pending"
 );
// Web3 eth call to get the gas prices, 
// and estimate the gas for next transfer
web3.eth.getGasPrice(function(e, r){
    gasPrice = r;
    console.log(r);
    web3.eth.estimateGas({
        "from"      : from_address,       
        "nonce"     : nonce, 
        "to"        : to_address,     
        "data"      : transfer_data
    }).then((result) => {
        esGas = result;
        console.log("Nonce: " + nonce +"\n"+ "Transfer Amount (ether): " + web3.utils.fromWei(amount.toString(), 'ether') + "\n" + "Estimated Gas (wei): " + (web3.utils.fromWei(gasPrice.toString(), 'ether') * esGas) * 1.5);
    });
});
} estimateTransactionGas();