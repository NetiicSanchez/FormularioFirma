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
    res.status(500).json({ error: error.message });
  }
});

// Ruta para descargar PDF de una respuesta específica
router.get('/pdf/:id', async (req, res) => {
  try {
    const respuesta = await Respuesta.findByPk(req.params.id);
    if (!respuesta) return res.status(404).send('No encontrada');

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="respuesta.pdf"');
    doc.pipe(res);

    //agregar una imagen de encabezado
    doc.image('public/imagenes/logopng.jpg', 40, 10, { width: 100 });

    // Encabezado
    //bajar el encabezado
    doc.moveDown(1.5); // Espacio antes del título
    doc
      .fontSize(20)
      .fillColor('#003366')
      .text('CALIFICACION DE HERRAMIENTAS', { align: 'center', underline: true });
 


    doc.moveDown();// Espacio después de la línea

    // Datos generales
    const fechaObj = new Date(respuesta.fecha);
    const fechaFormateada = fechaObj.toLocaleDateString('es-ES');
    doc
      .fontSize(12)
      .fillColor('black')
      .text(`Fecha: `, { continued: true })
      .font('Helvetica-Bold')
      .text(fechaFormateada)
      .font('Helvetica')
      .text(`Nombre: `, { continued: true })
      .font('Helvetica-Bold')
      .text(respuesta.nombre)
      .font('Helvetica');
    doc.moveDown();

    // Sección: Estado de herramientas y equipos
    doc
      .fontSize(13)
      .fillColor('#003366')
      .text('Estado de Herramientas y Equipos', { underline: true });
    doc.moveDown(0.5);

    // Tabla de respuestas (muestra el valor numérico tal cual)
    const campos = [
      ['Uniforme Adecuado', respuesta.uniformeAdecuado],
      ['Vestimenta Adecuada', respuesta.vestimentaAdecuada],
      ['Herramientas en buen Estado', respuesta.herramientasEstadoOK],
      ['Herramientas Completas', respuesta.herramientascompletas],
      ['Herramientas Eléctricas OK', respuesta.herramientaselectricasok],
      ['Equipos con Baterías OK', respuesta.equiposBateriasok],
      ['Transporte de Herramientas', respuesta.transporteherramientas],
      ['Uso de Alcohol', respuesta.usaalcohol],
      ['Uso de Plantilla', respuesta.usaplantilla],
      ['Equipos Calibrados', respuesta.equiposCalibrados],
      ['Protección Buen Estado', respuesta.proteccionBuenEstado],
      ['Trabajo en Equipo', respuesta.trabajoEnEquipo],
      ['Herramienta Adecuada Trabajo', respuesta.herramientaAdecuadaTrabajo],
      ['Herramienta Dañada Propio', respuesta.herramientaDañadoPropio],
      ['Sistema Organización', respuesta.sistemaOrganizacion],
      ['Usa Casco', respuesta.usaCasco],
      ['Usa Botas', respuesta.usaBotas],
      ['Usa Equipo Altura', respuesta.usaEquipoAltura],
      ['Usa Conos', respuesta.usaConos],
      //total la suma de todos los campos
      ['Total', 
        respuesta.uniformeAdecuado + 
        respuesta.vestimentaAdecuada + 
        respuesta.herramientasEstadoOK + 
        respuesta.herramientascompletas + 
        respuesta.herramientaselectricasok + 
        respuesta.equiposBateriasok + 
        respuesta.transporteherramientas + 
        respuesta.usaalcohol + 
        respuesta.usaplantilla + 
        respuesta.equiposCalibrados + 
        respuesta.proteccionBuenEstado + 
        respuesta.trabajoEnEquipo + 
        respuesta.herramientaAdecuadaTrabajo + 
        respuesta.herramientaDañadoPropio + 
        respuesta.sistemaOrganizacion + 
        respuesta.usaCasco + 
        respuesta.usaBotas + 
        respuesta.usaEquipoAltura + 
        respuesta.usaConos
      ]
    ];


    // Renderizado tipo tabla: muestra el valor tal cual está en la base de datos
 const startX = 60;
const valueX = 400;
let y = doc.y;

campos.forEach(([label, value]) => {
  doc
    .font('Helvetica-Bold')
    .fillColor('#222')
    .fontSize(12)
    .text(`${label}:`, startX, y, { continued: false, width: valueX - startX - 10, align: 'left' });

  doc
    .font('Helvetica')
    .fillColor('black')
    .fontSize(12)
    .text(
      value !== null && value !== undefined ? value.toString() : 'N/A',
      valueX,
      y,
      { width: 80, align: 'right' }
    );

  y = doc.y + 7; // Espacio entre filas
});
doc.moveDown();

doc.x = doc.page.margins.left;

// Observaciones alineadas a la izquierda
doc
  .fontSize(13)
  .fillColor('#003366')
  .text('Observaciones', { underline: true, align: 'left'});  
doc.moveDown(0.5);
doc
  .font('Helvetica')
  .fontSize(12)
  .fillColor('black')
  .text(respuesta.observaciones || 'Ninguna', { align: 'left' });
doc.moveDown(1.5); // Espacio antes de la firma

// Firma centrada
doc
  .fontSize(13)
  .fillColor('#003366')
  .text('Firma', { underline: true, align: 'center' }); // Esto centra el texto "Firma"
doc.moveDown(0.5);
if (respuesta.firma) {
  const img = respuesta.firma.replace(/^data:image\/\w+;base64,/, '');
  const buf = Buffer.from(img, 'base64');
  const firmaWidth = 200;
  const centerX = (doc.page.width - firmaWidth) / 2;
  doc.image(buf, centerX, doc.y, { width: firmaWidth });
  doc.moveDown();
} else {
  doc
    .font('Helvetica')
    .fontSize(12)
    .fillColor('black')
    .text('No hay firma.', { align: 'center' });
}
    // Pie de página
    doc.moveDown(2);
    doc
      .fontSize(10)
      .fillColor('gray')
      .text('Generado por el sistema de formularios', { align: 'center' });

    doc.end();
  } catch (err) {
    res.status(500).send('Error al generar el PDF');
  }
});

// Ruta para ver la vista previa de una respuesta específica

router.get('/vista/:id', async (req, res) => {
  try {
    const respuesta = await Respuesta.findByPk(req.params.id);
    if (!respuesta) return res.status(404).send('No encontrada');

    res.render('vista-previa', {
      nombre: respuesta.nombre,
      uniformeAdecuado: respuesta.uniformeAdecuado,
      vestimentaAdecuada: respuesta.vestimentaAdecuada,
      firma: respuesta.firma,
      id: respuesta.idformulario,
      herramientasEstadoOK: respuesta.herramientasEstadoOK,
      herramientascompletas: respuesta.herramientascompletas,
      herramientaselectricasok: respuesta.herramientaselectricasok,
      equiposBateriasok: respuesta.equiposBateriasok,
      transporteherramientas: respuesta.transporteherramientas,
      usaalcohol: respuesta.usaalcohol,
      usaplantilla: respuesta.usaplantilla,
      equiposcalibrados: respuesta.equiposCalibrados,
      proteccionbuenestado: respuesta.proteccionBuenEstado,
      trabajoenequipo: respuesta.trabajoEnEquipo,
      herramientaadecuadatrabajo: respuesta.herramientaAdecuadaTrabajo,
      herramientadañadopropio: respuesta.herramientaDañadoPropio,
      sistemaorganizacion: respuesta.sistemaOrganizacion,
      usaCasco: respuesta.usaCasco,
      usaBotas: respuesta.usaBotas,
      usaEquipoAltura: respuesta.usaEquipoAltura,
      usaConos: respuesta.usaConos,
  observaciones: respuesta.observaciones || 'Ninguna',
  // ...
  fecha: (() => {
    const fechaObj = new Date(respuesta.fecha);
    return fechaObj.toLocaleDateString('es-ES');
  })()
});
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cargar la vista previa');
  }
})

router.get('/seleccionar',async (req, res)=>{
  const respuestas = await Respuesta.findAll();
  res.render('seleccionar', { respuestas });
})



//ver si tiene funcionamiento despues 
router.post('/filtrar', async (req, res)=>{

  try{
    const {mes} = req.body;

    const iniciofecha = new Date (`${mes}-01`);
    const fechafinal= new Date (iniciofecha);
    fechafinal.setMonth(fechafinal.getMonth() + 1);
    

    const registros = await Respuesta.findAll({
      where: {
        fecha: {
          [Op.gte]: iniciofecha,
          [Op.lt]: fechafinal
        }
      }
    });
    res.json(registros);
  }catch (error) {
    console.error('Error al filtrar respuestas:', error);
    res.status(500).json({ error: 'Error al filtrar respuestas' });
  }
});

// Ruta para mostrar el formulario de filtrado

router.get('/filtrar', (req, res) => {
  res.render('form-filtrar', { registros: null, mes: null });
});

router.get('/filtrar-vista', async (req, res) => {
  try {
    const mes = req.query.mes;
    let registros = [];
    if (mes) {
      const iniciofecha = new Date(`${mes}-01`);
      const fechafinal = new Date(iniciofecha);
      fechafinal.setMonth(fechafinal.getMonth() + 1);

      registros = await Respuesta.findAll({
        where: {
          fecha: {
            [Op.gte]: iniciofecha,
            [Op.lt]: fechafinal
          }
        }
      });
    }
    res.render('form-filtrar', { registros, mes });
  } catch (error) {
    console.error('Error al mostrar respuestas filtradas:', error);
    res.status(500).send('Error al mostrar respuestas filtradas');
  }
});

router.post('/subir', upload.single('archivo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    const baseUrl = req.protocol + '://' + req.get('host');
    const fileUrl = baseUrl + `/uploads/${req.file.filename}`;

    res.json({
      fileId: req.file.filename,
      webViewLink: fileUrl,
      webContentLink: fileUrl,
      message: 'Archivo subido exitosamente'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;

