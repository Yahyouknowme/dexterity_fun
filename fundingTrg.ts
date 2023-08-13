import { clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";
import { Wallet } from "@project-serum/anchor";
import dexterityTs from "@hxronetwork/dexterity-ts";
const dexterity = dexterityTs;
import bs58 from 'bs58'

// Solana Testnet RPC for connection, which can be used later to get your manifest
const CLUSTER_NAME = "devnet";
const rpc = clusterApiUrl(CLUSTER_NAME);
// or your own RPC URL // const rpc = "https://your-own-rpc.com"

// Setting up our wallet with our Private Key so that we can sign transactions and create our trg account from it
const keypair = Keypair.fromSecretKey(
    Uint8Array.from([91,11,158,253,182,99,105,219,3,80,14,148,117,116,21,17,150,44,58,117,71,202,127,181,171,13,101,238,29,140,249,58,114,182,236,87,146,238,35,169,3,156,80,54,76,131,247,38,83,196,101,167,37,176,213,68,164,118,168,58,203,24,17,69])
  );

// From the keypair we can pass it to the Wallet() method to then be able to pass it in getManifest
const wallet = new Wallet(keypair);

const fundingTRG = async () => {

    // Get the latest manifest
    const manifest = await dexterity.getManifest(rpc, false, wallet);

    // BTC-USD Market-Product-Group PubKey
    const MPG = new PublicKey("HyWxreWnng9ZBDPYpuYugAfpCMkRkJ1oz93oyoybDFLB")
    // Our TRG for the BTC-USD MPG 
    const trgPubkey = new PublicKey("F6J2t2XSCErG78aVLCkCidouFsC4CquBwMYiw3dh9q6x");

    console.log(
        `Wallet: ${wallet.publicKey.toBase58()} TRG: ${trgPubkey.toBase58()}`
    );

    const trader = new dexterity.Trader(manifest, trgPubkey);

    const viewAccount = async() => {
        console.log(
          "Net Cash:",
          trader.getNetCash().toString(),
        );
    };

    viewAccount();

    const account = async() => await trader.connect(NaN,viewAccount)

    await account()

    const deposit_or_withdraw = async (type: string, amount: number) => {

        if (type === 'd') {
            try {
                console.log(`Depositing ${amount} UXDC...`);
                await trader.deposit(dexterity.Fractional.New(amount, 0));
                console.log(`Successfully Deposited ${amount} UXDC`)
                await account()
            } catch (error) {
                console.log(error)
            }
        } else if (type === 'w') {
            try {
                console.log(`Withdrawing ${amount} UXDC...`);
                await trader.withdraw(dexterity.Fractional.New(amount, 0));
                console.log(`Successfully Withdrawn ${amount} UXDC`) 
                await account()
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log('Error: Funding Type not valid; Valid Types: \\n1. \\d\\ => Deposit\\n2. \\w\\ => Withdraw')
            return
        }
    }

    deposit_or_withdraw('d', 100) // Deposit 5,000 UXDC into our TRG
    // deposit_or_withdraw('w', 5000) // Withdraw 5,000 UXDC from our TRG
}
   




fundingTRG()

