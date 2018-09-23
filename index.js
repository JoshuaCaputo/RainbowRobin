const API = 'YOURAPIKEYHERE!!!!!!!!!!!!!!!!!!!!!!';
console.log('             ___    _   ___ _  _ ___  _____      __           ');
console.log('            | _ \\  /_\\ |_ _| \\| | _ )/ _ \\ \\    / /  ');
console.log('            |   / / _ \\ | || .` | _ \\ (_) \\ \\/\\/ /   ');
console.log('            |_|_\\/_/ \\_\\___|_|\\_|___/\\___/ \\_/\\_/             ')
console.log('                   ___  ___  ___ ___ _  _                      ');
console.log('                  | _ \\/ _ \\| _ )_ _| \\| |  ');
console.log('                  |   / (_) | _ \\| || .` |         ');
console.log('                  |_|_\\\\___/|___/___|_|\\_|                     ')
console.log('  ___   ___   ___    ___    ___   ___    ___    ___   ___   ___ ');
var bitcore = require('bitcore-lib');
var EthereumBip44 = require('ethereum-bip44');
var fs = require('fs');

// @dev: Set up output log
var stream = fs.createWriteStream('logs/default-log.txt', {flags:'a'});
stream.write('\n-\n-\n')
stream.write('['+Date.now()+']'+' Session Started\n');

// @dev: Constant Valiables
// - START_TIME: The time the script was initialized
// - URL: The URL to access the API from
// - API: The API Key to use with the URL
// - URL2: Appended to the URL (URL+_address_+URL2)
// - DEPTH: How many accounts to scan in each wallet
// - HEIGHT: Number of wallets to check
// - FREQUENCY: Time (ms) between API calls
const START_TIME = Date.now();
var etherURL = 'http://api.etherscan.io/api?module=account&action=txlist&address=0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae&startblock=0&endblock=99999999&sort=asc&apikey=YourApiKeyToken';
const DEPTH = 5;
const HEIGHT = 1000;
const FREQUENCY = 300;

// @dev: Return a new master private key
function genKey(){
	return bitcore.HDPrivateKey();
};

// @dev: Return a wallet from a private key
function genWallet(_key){
	return new EthereumBip44(_key);
};

// @dev: Return a transaction count from an address (address _address, function _callback)
// @async: Response -> proceed to the callback function
function getTransactionCount(_address, _callback){
	let _url = etherURL.replace('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',_address).replace('YourApiKeyToken', API);
	console.log('Getting Transactions for', _address, _url)
	const request = require('request');

	request(_url, { json: true }, (err, res, body) => {
	  if (err) { return console.log(err); }
	  if (!body.result) return console.log(res.statusCode);
	  let _numTX = body.result.length;
	  if (_numTX > 0) {
	  	stream.write('[FOUND TX] - Address['+_address+'] - Transactions['+_numTX+'] - wallet['+wallet+JSON.stringify(wallet)+'] key['+key+JSON.stringify(key)+']')
	  	console.log('Found Transactions for Account', _numTX, _address)
	  }
	  else {
	  	console.log('No Transactions for Account', _address)
	  }
	  setTimeout(function(){
	  	_callback();
	  }, FREQUENCY)
	});
};


function cross(_distance){
	key = genKey();
	wallet = genWallet(key);

	function dive(_depth){
		var scope = this;
		let address = wallet.getAddress(_depth)
		if (_depth < DEPTH){
			getTransactionCount(address, function(){
				dive(_depth+1)
			})
		}
		else {
			getTransactionCount(address, function(){
				if (_distance < HEIGHT){
					console.log('next wallet...')
					cross(_distance+1);
				}
				else {
					console.log('  ___   ___   ___    ___    ___   ___    ___    ___   ___   ___ ');
					console.log()
					console.log('              ___ ___  __  __ ___ _    ___ _____ ___            ');
					console.log('             / __/ _ \\|  \\/  | _ \\ |  | __|_   _| __|   ');
					console.log('            | (_| (_) | |\\/| |  _/ |__| _|  | | | _|   ');
					console.log('             \\___\\___/|_|  |_|_| |____|___| |_| |___|           ')
					console.log('  ___   ___   ___    ___    ___   ___    ___    ___   ___   ___ ');
					let elapsed = Date.now() - START_TIME;
					stream.write('['+Date.now()+']'+' Session Ended\n');
					stream.write('+ elapsed time: '+ elapsed + '(ms) '+ elapsed/1000+ '(s) '+ (elapsed/1000)/8640+ '(d)')
					stream.write('\n')
					console.log('+ elapsed time', elapsed, '(ms)', elapsed/1000, '(s)', (elapsed/1000)/8640, '(d)')
					stream.end();
				}
			})
		}
	}
	dive(0)
}
cross(0)
