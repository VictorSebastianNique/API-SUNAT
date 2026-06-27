// Generador de XML UBL 2.1 para Facturas y Boletas

function generateInvoiceXML(saleData) {
  // Aquí se arma el string XML o se usa una librería de constructores XML
  // Incluye todos los nodos requeridos por SUNAT (UBLVersionID, CustomizationID, etc.)
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2">
  <ext:UBLExtensions>
    <ext:UBLExtension>
      <ext:ExtensionContent>
        <!-- FIRMA -->
      </ext:ExtensionContent>
    </ext:UBLExtension>
  </ext:UBLExtensions>
  <cbc:UBLVersionID>2.1</cbc:UBLVersionID>
  <cbc:CustomizationID>2.0</cbc:CustomizationID>
  <cbc:ID>${saleData.serie || 'B001'}-${saleData.correlativo || '00000001'}</cbc:ID>
  <cbc:IssueDate>${saleData.date || new Date().toISOString().split('T')[0]}</cbc:IssueDate>
  <!-- Simulación de más nodos... -->
</Invoice>`;

  return xml;
}

module.exports = { generateInvoiceXML };
