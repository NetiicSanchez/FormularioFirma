const express = require('express');
const router = express.Router();
const multer = require('multer');
const PDFDocument = require('pdfkit');
const Respuesta = require('../modelos/Respuestas.js');
const Respuestasupervisor= require('../modelos/respuestasupervisor.js')
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Configuración de multer para guardar archivos localmente
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    // Crear directorio si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generar nombre único con timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB límite
  },
  fileFilter: function (req, file, cb) {
    // Solo permitir imágenes
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  }
});

router.post('/', async (req, res) => {
    try {
        const respuesta = await Respuesta.create(req.body);
        res.status(201).json(respuesta);
    } catch (error) {
        console.error('Error al crear la respuesta:', error);
        res.status(500).json({ error: 'Error al crear la respuesta' });
    }
});

router.post('/supervisioninst', upload.fields([
  { name: 'fotoetiquetaont' },
  { name: 'fotoont' },
  { name: 'fotoubicacionont' },
  { name: 'fotopotenciaont' },
  { name: 'fotoordenamientoreserva' },
  { name: 'fotoetiquetanap' },
  { name: 'fotopotencianap' },
  { name: 'firma' }
]), async (req, res) => {
  try {
    // Construir objeto con rutas de archivos
    const fotos = {};
    const baseUrl = req.protocol + '://' + req.get('host');
    
    for (const campo of [
      'fotoetiquetaont', 'fotoont', 'fotoubicacionont', 'fotopotenciaont',
      'fotoordenamientoreserva', 'fotoetiquetanap', 'fotopotencianap', 'firma'
    ]) {
      if (req.files[campo]) {
        // Generar URL accesible para la imagen
        const relativePath = `/uploads/${req.files[campo][0].filename}`;
        fotos[campo] = baseUrl + relativePath;
      }
    }

    // Crea el registro en la base de datos con las rutas locales
    const data = {
      ...req.body,
      ...fotos
    };
    
    const respuesta = await Respuestasupervisor.create(data);
    res.status(201).json({ success: true, message: 'Datos guardados exitosamente' });
  } catch (error) {
    console.error('Error al crear la respuesta de supervisión:', error);
    res.status(500).json({ error: 'Error al crear la respuesta' });
  }
});

// Ruta para descargar PDF de una respuesta específica
router.get('/pdf/:id', async (req, res) => {
  try {
    const respuesta = await Respuestasupervisor.findByPk(req.params.id);
    if (!respuesta) {
      return res.status(404).json({ error: 'Respuesta no encontrada' });
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="respuesta-${req.params.id}.pdf"`);
    
    doc.pipe(res);
    
    // Generar contenido del PDF
    doc.fontSize(16).text('Reporte de Supervisión', { align: 'center' });
    doc.moveDown();
    
    // Agregar datos del formulario
    doc.fontSize(12);
    doc.text(`Supervisor: ${respuesta.nombresupervisor || 'N/A'}`);
    doc.text(`Técnico: ${respuesta.nombretecnico || 'N/A'}`);
    doc.text(`Fecha: ${respuesta.fecha || 'N/A'}`);
    doc.text(`Cliente: ${respuesta.nombrecliente || 'N/A'}`);
    doc.text(`Código NET: ${respuesta.codigonet || 'N/A'}`);
    doc.text(`Ticket: ${respuesta.numeroticket || 'N/A'}`);
    doc.moveDown();
    
    // Agregar observaciones
    if (respuesta.observaciones) {
      doc.text(`Observaciones: ${respuesta.observaciones}`);
    }
    
    doc.end();
  } catch (err) {
    console.error('Error al generar PDF:', err);
    res.status(500).json({ error: 'Error al generar PDF' });
  }
});

// Ruta para ver la vista previa de una respuesta específica
router.get('/vista/:id', async (req, res) => {
  try {
    const respuesta = await Respuestasupervisor.findByPk(req.params.id);
    if (!respuesta) {
      return res.status(404).json({ error: 'Respuesta no encontrada' });
    }
    res.render('vista-previa', { respuesta });
  } catch (err) {
    console.error('Error al mostrar vista previa:', err);
    res.status(500).json({ error: 'Error al mostrar vista previa' });
  }
});

router.get('/seleccionar',async (req, res)=>{
  const respuestas = await Respuestasupervisor.findAll();
  res.render('seleccionar', { respuestas });
});

router.post('/filtrar', async (req, res)=>{
  try{
    const { mes } = req.body;
    
    if (!mes) {
      return res.status(400).json({ error: 'El mes es requerido' });
    }

    const [year, month] = mes.split('-');
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const registros = await Respuestasupervisor.findAll({
      where: {
        fecha: {
          [Op.between]: [startDate, endDate]
        }
      }
    });

    res.render('form-filtrar', { registros, mes });
  } catch (error) {
    console.error('Error al filtrar registros:', error);
    res.status(500).json({ error: 'Error al filtrar registros' });
  }
});

// Ruta para mostrar el formulario de filtrado
router.get('/filtrar', (req, res) => {
  res.render('form-filtrar', { registros: null, mes: null });
});

router.get('/filtrar-vista', async (req, res) => {
  try {
    const { mes } = req.query;
    
    if (!mes) {
      return res.status(400).json({ error: 'El parámetro mes es requerido' });
    }

    const [year, month] = mes.split('-');
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const registros = await Respuestasupervisor.findAll({
      where: {
        fecha: {
          [Op.between]: [startDate, endDate]
        }
      }
    });

    res.json(registros);
  } catch (error) {
    console.error('Error al filtrar registros para vista:', error);
    res.status(500).json({ error: 'Error al filtrar registros' });
  }
});

module.exports = router;
