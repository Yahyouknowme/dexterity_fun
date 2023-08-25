import { clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";
import { Wallet } from "@project-serum/anchor";
import dexterityTs from "@hxronetwork/dexterity-ts";
const dexterity = dexterityTs;
import bs58 from 'bs58'

// Solana Testnet RPC for connection, we can use this later to get our manifest
const CLUSTER_NAME = "devnet";
const rpc = clusterApiUrl(CLUSTER_NAME);
// or your own testnet RPC URL // const rpc = "https://your-own-rpc.com"

// Setting up our wallet with our Private Key so that we can sign transactions and create our trg account from it
const keypair = Keypair.fromSecretKey(
    Uint8Array.from([91,11,158,253,182,99,105,219,3,80,14,148,117,116,21,17,150,44,58,117,71,202,127,181,171,13,101,238,29,140,249,58,114,182,236,87,146,238,35,169,3,156,80,54,76,131,247,38,83,196,101,167,37,176,213,68,164,118,168,58,203,24,17,69])
  );

// From the keypair we can pass it to the Wallet() method to then be able to pass it in getManifest
const wallet = new Wallet(keypair);

const accountTRG = async () => {

    // Get the latest manifest
    const manifest = await dexterity.getManifest(rpc, false, wallet);

    // BTC-USD Market-Product-Group PubKey
    const MPG = new PublicKey("HyWxreWnng9ZBDPYpuYugAfpCMkRkJ1oz93oyoybDFLB")
    // Our TRG for the BTC-USD MPG 
    const trgPubkey = new PublicKey("F6J2t2XSCErG78aVLCkCidouFsC4CquBwMYiw3dh9q6x");

    console.log(
        `Wallet: ${wallet.publicKey.toBase58()} TRG: ${trgPubkey.toBase58()}`
    );

    const PRODUCT_NAME = 'BTCUSD-PERP';
    const trader = new dexterity.Trader(manifest, trgPubkey);

    const streamAccount = () => {
        console.log(
          'Portfolio Value:',
        //   trader.getPortfolioValue().toString(),
          'Position Value:',
        //   trader.getPositionValue().toString(),
          'Net Cash:',
        //   trader.getNetCash().toString(),
          'PnL:',
        //   trader.getPnL().toString()
        );
      };

      const account = async () => {
        await trader.connect(NaN, streamAccount);
    };
    
    // await account()

    let perpIndex: any;
    for (const [name, {index, product}] of trader.getProducts()) {
      console.log('saw', name, ' ', index);
      if (name !== PRODUCT_NAME) {
        continue;
      }
      perpIndex = index;
      break;
    }

    		// 1.0000 contracts
            const QUOTE_SIZE = dexterity.Fractional.New(1, 0);

            const price = 29_000

            const dollars = dexterity.Fractional.New(price, 0);

            trader.newOrder(perpIndex, true, dollars, QUOTE_SIZE).then(async () => {
                console.log(`Placed Buy Limit Order at $${dollars}`);
                await account();
          })
}

accountTRG()