const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const Respuesta = require('../modelos/Respuestas.js');

router.post('/', async (req, res) => {
    try {
        const respuesta = await Respuesta.create(req.body);
        res.status(201).json(respuesta);
    } catch (error) {
        console.error('Error al crear la respuesta:', error);
        res.status(500).json({ error: 'Error al crear la respuesta' });
    }
});



router.get('/formulario/pdf', async (req, res) => {
  try {
    const datos = await respuestasformulario.findAll();

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="reporte-formulario.pdf"');
    doc.pipe(res);

    doc.fontSize(20).text('REPORTE DE FORMULARIOS', { align: 'center' });
    doc.moveDown();

    datos.forEach((item, i) => {
      doc.fontSize(12).text(`Registro #${i + 1}`, { underline: true });
      doc.text(`Nombre: ${item.nombre}`);
      doc.text(`Uniforme adecuado: ${item.uniformeAdecuado}`);
      doc.text(`Vestimenta adecuada: ${item.vestimentaAdecuada}`);
      doc.text(`Herramientas completas: ${item.herramientasCompletas}`);
      doc.text(`Equipo calibrado: ${item.equiposCalibrados}`);
      doc.text(`Observaciones: ${item.observaciones}`);
      doc.moveDown();
    });

    doc.end();
  } catch (err) {
    console.error('Error al generar PDF:', err);
    res.status(500).json({ error: 'No se pudo generar el PDF' });
  }
});
module.exports = router;
