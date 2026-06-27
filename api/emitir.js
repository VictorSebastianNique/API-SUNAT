const { generateInvoiceXML } = require('../utils/ublGenerator');
const { signXml } = require('../utils/signer');
const { sendToSunat } = require('../utils/sunatClient');

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const saleData = req.body;
    
    // 1. Validar Token/API Key
    const apiKey = req.headers['authorization'];
    if (apiKey !== `Bearer ${process.env.API_KEY}`) {
       return res.status(401).json({ error: 'Unauthorized' });
    }

    // 2. Generar XML UBL 2.1
    const xmlUnsigned = generateInvoiceXML(saleData);

    // 3. Firmar XML
    const xmlSignedData = await signXml(xmlUnsigned, process.env.CERT_BASE64, process.env.CERT_PASSWORD);

    // 4. Enviar a SUNAT (Solo si no estamos en modo offline/test puro)
    const sunatResponse = await sendToSunat(xmlSignedData.xml, xmlSignedData.fileName);

    // 5. Responder a la caja
    return res.status(200).json({
      success: true,
      hash: xmlSignedData.hash,
      sunatResponse: sunatResponse,
      qrData: `${process.env.SUNAT_RUC}|${saleData.documentType}|${saleData.serie}|${saleData.correlativo}|${saleData.igv}|${saleData.total}|${saleData.date}|${saleData.customerDocumentType}|${saleData.customerDocumentNumber}|${xmlSignedData.hash}`
    });

  } catch (error) {
    console.error('Error emitiendo comprobante:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
