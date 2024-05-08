const { createCreateTreeInstruction, PROGRAM_ID: BUBBLEGUM_PROGRAM_ID, createMintToCollectionV1Instruction, TokenProgramVersion } = require("@metaplex-foundation/mpl-bubblegum");
const { loadWalletKey, sendVersionedTx } = require("./utils");
const { Connection, Keypair, PublicKey } = require("@solana/web3.js");
const { SPL_ACCOUNT_COMPRESSION_PROGRAM_ID, SPL_NOOP_PROGRAM_ID } = require("@solana/spl-account-compression");
const { PROGRAM_ID: TOKEN_METADATA_PROGRAM_ID } = require("@metaplex-foundation/mpl-token-metadata");

async function mintOneCNFT() {

    const keypair = loadWalletKey("CNFTRtkay548T1MiEdzYFvKTCSpiD2f4LdiBPkn4xP3e.json");
    const connection = new Connection("https://api.devnet.solana.com");
    const merkleTree = loadWalletKey("TrEv8JqBGHFLZ4CdAjVs2xUdw6wJggHCWLpqiGV3m7x.json").publicKey;

    const tokenId = 10791;
    const tokenName = "My Custom Token";
    const tokenDescription = "This is a unique custom token.";

    const customUriObject = {
        image: `https://as2.ftcdn.net/v2/jpg/03/30/98/07/500_F_330980790_wuh1AA42ty8tNmx5ZiphmL7R4tIQduOQ.jpg`, 
    };
    
    const customUri = "data:application/json;base64," + Buffer.from(JSON.stringify(customUriObject)).toString("base64");

    const [treeAuthority, _bump] = PublicKey.findProgramAddressSync(
        [merkleTree.toBuffer()],
        BUBBLEGUM_PROGRAM_ID,
      );
      
    const collectionMint = new PublicKey("coLbQnuXqx6idS6MZ2yrdPgVXqg1eoAW1Cvt24MnKpD")
    const [collectionMetadataAccount, _b1] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata", "utf8"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          collectionMint.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      );
      const [collectionEditionAccount, _b2] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata", "utf8"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          collectionMint.toBuffer(),
          Buffer.from("edition", "utf8"),
        ],
        TOKEN_METADATA_PROGRAM_ID
      );
      const [bgumSigner, __] = PublicKey.findProgramAddressSync(
        [Buffer.from("collection_cpi", "utf8")],
        BUBBLEGUM_PROGRAM_ID
      );

    const ix = await createMintToCollectionV1Instruction({
        treeAuthority: treeAuthority,
        leafOwner: keypair.publicKey,
        leafDelegate: keypair.publicKey,
        merkleTree: merkleTree,
        payer: keypair.publicKey,
        treeDelegate: keypair.publicKey,
        logWrapper: SPL_NOOP_PROGRAM_ID,
        compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
        collectionAuthority: keypair.publicKey,
        collectionAuthorityRecordPda: BUBBLEGUM_PROGRAM_ID,
        collectionMint: collectionMint,
        collectionMetadata: collectionMetadataAccount,
        editionAccount: collectionEditionAccount,
        bubblegumSigner: bgumSigner,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
    }, {
        metadataArgs: {
            collection: {key:collectionMint, verified: false},
            creators: [],
            isMutable: true,
            name: "Just a cNFT by Certi",
            primarySaleHappened: true,
            sellerFeeBasisPoints: 0,
            symbol: "cNFT",
            uri: customUri,
            uses: null,
            tokenStandard: null,
            editionNonce: null,
            tokenProgramVersion: TokenProgramVersion.Original
        }
        
    });
    
    
    const sx = await sendVersionedTx(connection, [ix], keypair.publicKey, [keypair])
    console.log(sx);
}


  module.exports = { mintOneCNFT };
