import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
const contractAddress ="0x2C6cD2264a086202135e1558a9196Bb9EB262903";
const ABI = [
	{
		"inputs": [],
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "isWinner",
				"type": "bool"
			}
		],
		"name": "GamePlayed",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_side",
				"type": "uint256"
			}
		],
		"name": "playGame",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
];
let signer = null;
let contract = null;
let provider = null;



async function init() {
	provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    const accounts = await provider.listAccounts();
    signer = await provider.getSigner();

    contract = new ethers.Contract(contractAddress, ABI, signer);

    console.log("Signer address:", await signer.getAddress());
}

async function play(side){
    let amountInWei = ethers.parseEther((0.000001).toString());

    console.log(amountInWei);
	await contract.playGame(side,{value: amountInWei});
}

async function getGamePlayed(){
    let queryResult =  await contract.queryFilter('GamePlayed', await provider.getBlockNumber() - 5000, await provider.getBlockNumber());
    let queryResultRecent = queryResult[queryResult.length-1]
   
    let player = await queryResultRecent.args.player.toString();
    let result = await queryResultRecent.args.isWinner.toString();

    let resultLogs = `
    player: ${player}, 
    result: ${result == "false" ? "LOSE 😥": "WIN 🎉"}`;
    console.log(resultLogs);

    let resultLog = document.getElementById("result");
    resultLog.innerText = resultLogs;
}

async function startApp() {
    await init();

    document.getElementById("play0").addEventListener("click", () => play(0));
	document.getElementById("play1").addEventListener("click", () => play(1));
	document.getElementById("getGamePlayed").addEventListener("click", getGamePlayed);
}
startApp().catch(console.error);
 

