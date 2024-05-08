const { Connection, Keypair, PublicKey, Signer, TransactionInstruction, TransactionMessage, VersionedTransaction } = require("@solana/web3.js");
const fs = require("fs");
const path = require("path");

function loadWalletKey(keypairFile) {
    const filePath = path.join(__dirname, keypairFile);
    const privateKeyArray = JSON.parse(fs.readFileSync(filePath));
    const privateKeyUint8Array = new Uint8Array(privateKeyArray);
    return Keypair.fromSecretKey(privateKeyUint8Array);
}

async function sendVersionedTx(
    connection, 
    instructions, 
    payer,
    signers) {
    let latestBlockhash = await connection.getLatestBlockhash();
    const messageLegacy = new TransactionMessage({
        payerKey: payer,
        recentBlockhash: latestBlockhash.blockhash,
        instructions,
    }).compileToLegacyMessage();
    const transaction = new VersionedTransaction(messageLegacy);
    transaction.sign(signers);
    const signature = await connection.sendTransaction(transaction);
    return signature;
}

module.exports = { loadWalletKey, sendVersionedTx };