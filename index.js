// Import Solana web3 functinalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL
} = require("@solana/web3.js");

// initialize the userRes and publicKey variable
let userRes = ''
let publicKey = ''

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

// Create a new keypair
// const newPair = new Keypair();

// Exact the public and private key from the keypair
// const publicKey = new PublicKey(newPair._keypair.publicKey).toString();
// const privateKey = newPair._keypair.secretKey;

const readLineAsync = msg => {
    return new Promise(resolve => {
      readline.question(msg, userRes => {
        resolve(userRes);
      });
    });
  }

const startApp = async() => {
    const userRes = await readLineAsync("What is your public key? ");
    readline.close();
    console.log("Your pub key is: " + userRes );
    // if userRes is not empty, then set publicKey to userRes
    publicKey = userRes ? new PublicKey(userRes) : console.log('Error: Public key is empty')
    
  }

// Connect to the Devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

console.log("Public Key", publicKey);

// Get the wallet balance from a given private key
const getWalletBalance = async () => {
    try {
        // Connect to the Devnet
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        // console.log("Connection object is:", connection);
        
        const walletBalance = await connection.getBalance(
            new PublicKey(publicKey)
        );
        console.log(`Wallet balance: ${parseInt(walletBalance) / LAMPORTS_PER_SOL} SOL`);
    } catch (err) {
        console.log(err);
    }
};

const airDropSol = async () => {
    try {
        // Connect to the Devnet and make a wallet from privateKey
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        // const myWallet = await Keypair.fromSecretKey(privateKey);

        // Request airdrop of 2 SOL to the wallet
        console.log("Airdropping some SOL to my wallet!");
        const fromAirDropSignature = await connection.requestAirdrop(
            new PublicKey(publicKey),
            2 * LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(fromAirDropSignature);
    } catch (err) {
        console.log(err);
    }
};

// Show the wallet balance before and after airdropping SOL
const mainFunction = async () => {
    await startApp();
    await getWalletBalance();
    await airDropSol();
    await getWalletBalance();
}

mainFunction();