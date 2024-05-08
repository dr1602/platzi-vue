const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const { sendEmail } = require('./src/emailSender'); // Importa la función sendEmail desde emailSender.js
const { default: axios } = require('axios');
const { mintOneCNFT } = require('./src/mintOneCNFT'); // Agrega el require para mintOneCNFT

const app = express();
app.use(bodyParser.json());

const whitelist = ['localhost:5173/','http://localhost:5173/', 'https://certiblocks.io/', 'http://localhost:5173/certificate-category/(.*)', 'https://backend-beige-three.vercel.app/'];
const options = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('no permitido'));
    }
  }
}
app.use(cors());

//Mnadar correos
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    const emailSent = await sendEmail(to, subject, text); // Utiliza la función sendEmail

    if (emailSent) {
      res.status(200).json({ message: 'Email sent successfully' });
    } else {
      res.status(500).json({ error: 'An error occurred while sending the email' });
    }
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'An error occurred while sending the email' });
  }
});

// Obtener información de transacción desde Solana
app.get('/api/get-solana-transaction/:signature', async (req, res) => {
  const { signature } = req.params;

  try {
    const solanaResponse = await axios.get(`https://api.devnet.solana.com/v2/tx/${signature}?format=json`);
    res.json(solanaResponse.data);
  } catch (error) {
    console.error('Error fetching Solana transaction:', error);
    res.status(500).json({ error: 'Error fetching Solana transaction' });
  }
});

// Ruta para mintear un CNFT
app.post('/api/mint-cnft', async (req, res) => {
  try {
    await mintOneCNFT(); // Llama a la función mintOneCNFT
    res.status(200).json({ message: 'CNFT minted successfully' });
  } catch (error) {
    console.error('Error minting CNFT:', error);
    res.status(500).json({ error: 'An error occurred while minting CNFT' });
  }
});

//Servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`El server está activo en el puerto  ${PORT}`);
});



