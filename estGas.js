
const Web3 = require('web3');
// change the RPC if you want to switch networks / providers
const web3 = new Web3('https://evm.cryptocurrencydevs.org');

// VARIABLES
// Initialize to_address, from_address, transfer_type, and transfer_amount values.
var transfer_type = 'mid';
let transfer = {
    from_address: '0xB9F96789D98407B1b98005Ed53e8D8824D42A756',
    to_address: '0x6690004E7F83AbEF341dD0DBD326CC55Ba9F1075',
    gas_float_percentage: transfer_type == 'standard' ? 1.2 : transfer_type == 'mid' ? 1.5 : transfer_type == 'priority' ? 2 : 1,
    transfer_amount: 100
}
// FUNCTION
// function to estimate gas for next transfer()
async function estimateTransactionGas(transfer){
let amount = transfer.transfer_amount;
// deprecated in favor of web3.utils.toWei(amount.toString(), "ether")
// let convert_precision = (10**decimals);
let amount_to_wei = web3.utils.toWei(amount.toString(), 'ether');
// // function signature: first 4 bytes of the sha3 hash
let function_signature = web3.utils.sha3('transfer(address,uint256)').substring(0,10)
// // we have to make the address field 32 bytes
let address_param = '0'.repeat(24)+transfer.to_address.substring(2)
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
    transfer.from_address,
    "pending"
 );
// Web3 eth call to get the gas prices, 
// and estimate the gas for next transfer
web3.eth.getGasPrice(function(e, r){
    gasPrice = r;
    console.log("Gas Price: "+r);
    web3.eth.estimateGas({
        "from"      : transfer.from_address,       
        "nonce"     : nonce, 
        "to"        : transfer.to_address,     
        "data"      : transfer_data
    }).then((result) => {
        esGas = result;
        console.log("Nonce: " + nonce +"\n"+ "Transfer Amount (ether): " + web3.utils.fromWei(amount_to_wei.toString(), 'ether') + "\n" + "Transfer Amount (wei): " + amount_to_wei.toString() + "\n" + "Estimated Gas (wei): " + (web3.utils.fromWei(gasPrice.toString(), 'ether') * esGas) * transfer.gas_float_percentage);
    });
});
} estimateTransactionGas(transfer);