const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
const contractAddress = 'YOUR_CONTRACT_ADDRESS';
const abi = [/* Contract ABI here */];
const contract = new web3.eth.Contract(abi, contractAddress);

function parseAndAirdrop() {
    const file = document.getElementById('csvFile').files[0];
    if (!file) {
        return alert('Please upload a CSV file.');
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const text = event.target.result;
        const data = csvToArray(text);
        distributeTokens(data);
    };
    reader.readAsText(file);
}

function csvToArray(str, delimiter = ",") {
    const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");
    const arr = rows.map(function (row) {
        const values = row.split(delimiter);
        const el = headers.reduce(function (object, header, index) {
            object[header] = values[index];
            return object;
        }, {});
        return el;
    });
    return arr; // Array of objects
}

async function distributeTokens(data) {
    const accounts = await web3.eth.getAccounts();
    for (let entry of data) {
        const recipient = entry['Address'];
        const amount = entry['Amount'];
        try {
            await contract.methods.distributeTokens([recipient], [amount]).send({ from: accounts[0] });
            console.log(`Airdropped ${amount} tokens to ${recipient}`);
        } catch (error) {
            console.error(`Failed to airdrop to ${recipient}: ${error.message}`);
        }
    }
}
