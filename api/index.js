const cors = require('cors');
const express = require('express');
// const proxyServer = require('../proxy-server'); // Importa el archivo del servidor con el proxy
const { approveUseAuthorityArgsBeet } = require('@metaplex-foundation/mpl-token-metadata');
const port = porcess.env.PORT || 3001;

const app = express();
app.use(bodyParser.json());

const whitelist = ['http://localhost:5173/', 'https://certiblocks.io/', 'http://localhost:5173/certificate-category/(.*)'];
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

//Enabling CORS in a single Node.js Serverless Function

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

const handler = (req, res) => {
  const d = new Date()
  res.end(d.toString())
}

module.exports = allowCors(handler)


// Inicia el servidor backend con el proxy
// proxyServer(app);

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