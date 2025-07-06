import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { Program, Wallet, AnchorProvider, Idl } from "@coral-xyz/anchor";
import { IDL, Turbin3Prereq } from "./programs/Turbin3_prereq";
import wallet from "./Turbin3-wallet.json";
import { SYSTEM_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/native/system";
const MPL_CORE_PROGRAM_ID = new PublicKey(
  "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
);

const PROGRAM_ID = new PublicKey("TRBZyQHB3m68FGeVsqTK39Wm4xejadjVhP5MAZaKWDM");
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
const connection = new Connection("https://api.devnet.solana.com", {
  commitment: "confirmed",
});

//creating anchor provider

const provider = new AnchorProvider(connection, new Wallet(keypair), {
  commitment: "confirmed",
});

// creating our program
const program = new Program<Turbin3Prereq>(
  IDL,
  provider,
);

//creating PDA
const account_seeds = [Buffer.from("prereqs"), keypair.publicKey.toBuffer()];
const [account_key, _account_bump] = PublicKey.findProgramAddressSync(
  account_seeds,
  program.programId
);
const mintCollection = new PublicKey(
  "5ebsp5RChCGK7ssRZMVMufgVZhd2kFbNaotcZ5UvytN2"
);
const mintTs = Keypair.generate();

// (async () => {
//   try {
//     const txhash = await program.methods
//       .initialize("udayempire")
//       .accountsPartial({
//         user: keypair.publicKey,
//         account: account_key,
//         systemProgram: SystemProgram.programId,
//       })
//       .signers([keypair])
//       .rpc();
//     console.log(
//       `Success! Check out your TX here: https://explorer.solana.com/tx/${txhash}?cluster=devnet`
//     );
//   } catch (err) {
//     console.error(`Oops, something went wrong: ${err}`);
//   }
// })();

(async ()=>{
    try{
        const txhash = await program.methods.submitTs().accountsPartial({
            user: keypair.publicKey,
            account:account_key,
            mint: mintTs.publicKey,
            collection: mintCollection,
            mpl_core_program: MPL_CORE_PROGRAM_ID,
            system_program: SYSTEM_PROGRAM_ID
        }).signers([keypair,mintTs]).rpc();
        console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    }catch(err){
        console.error(`Oops! something went wrong: ${err}`)
    }
})()
