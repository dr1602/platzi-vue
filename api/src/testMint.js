const { mintOneCNFT } = require('./mintOneCNFT');

(async () => {
    try {
        await mintOneCNFT();
        console.log("Minting CNFT successful!");
    } catch (error) {
        console.error("Error minting CNFT:", error);
    }
})();