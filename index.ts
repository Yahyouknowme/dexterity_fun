import { clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";
import { Wallet } from "@project-serum/anchor";
import dexterityTs from "@hxronetwork/dexterity-ts";
const dexterity = dexterityTs;
import bs58 from 'bs58'

const CLUSTER_NAME = "devnet";
const rpc = clusterApiUrl(CLUSTER_NAME);

const keypair = Keypair.fromSecretKey(
  Uint8Array.from([91,11,158,253,182,99,105,219,3,80,14,148,117,116,21,17,150,44,58,117,71,202,127,181,171,13,101,238,29,140,249,58,114,182,236,87,146,238,35,169,3,156,80,54,76,131,247,38,83,196,101,167,37,176,213,68,164,118,168,58,203,24,17,69])
);
const wallet = new Wallet(keypair);

const CreateTRG = async() => {
  
    // get the latest manifest
    const manifest = await dexterity.getManifest(rpc, false, wallet);

    const MPG = "HyWxreWnng9ZBDPYpuYugAfpCMkRkJ1oz93oyoybDFLB"
    const mpgPubkey = new PublicKey(MPG);

    const trgPubkey = await manifest.createTrg(mpgPubkey);

    console.log("success! trg pubkey:", trgPubkey);

  
  }
  
  CreateTRG()