document.addEventListener('DOMContentLoaded', function() {
  // Obtener referencias al canvas y contexto
  const canvas = document.getElementById('signatureCanvas');
  const ctx = canvas.getContext('2d');
  let drawing = false;

  // Funcionalidad para dibujar con mouse
  canvas.addEventListener('mousedown', (event) => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
  });
  canvas.addEventListener('mouseup', () => drawing = false);
  canvas.addEventListener('mouseleave', () => drawing = false);
  canvas.addEventListener('mousemove', (event) => {
    if (drawing) {
      ctx.lineTo(event.offsetX, event.offsetY);
      ctx.stroke();
    }
  });

  // Funcionalidad para dibujar con touch (móvil)
  canvas.addEventListener('touchstart', (event) => {
    event.preventDefault();
    drawing = true;
    const rect = canvas.getBoundingClientRect();
    const touch = event.touches[0];
    ctx.beginPath();
    ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
  });
  canvas.addEventListener('touchend', (event) => {
    event.preventDefault();
    drawing = false;
  });
  canvas.addEventListener('touchmove', (event) => {
    event.preventDefault();
    if (drawing) {
      const rect = canvas.getBoundingClientRect();
      const touch = event.touches[0];
      ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
      ctx.stroke();
    }
  });

  // Botón para limpiar la firma
  document.getElementById('clearSignature').addEventListener('click', function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  // Manejar el envío del formulario
  document.getElementById('surveyForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Capturar todas las respuestas
    const formData = {
      nombre: document.getElementById('nombre').value,
      uniformeAdecuado: document.getElementById('pregunta1').value,
      vestimentaAdecuada: document.getElementById('pregunta2').value,
      herramientasEstadoOK: document.getElementById('pregunta3').value,
      equiposBateriasok: document.getElementById('pregunta6').value,
      herramientascompletas: document.getElementById('pregunta4').value,
      herramientaselectricasok: document.getElementById('pregunta5').value,
      transporteherramientas: document.getElementById('pregunta7').value,
      usaalcohol: document.getElementById('pregunta8').value,
      usaplantilla: document.getElementById('pregunta9').value,
      equiposCalibrados: document.getElementById('pregunta10').value,
      proteccionBuenEstado: document.getElementById('pregunta11').value,
      trabajoEnEquipo: document.getElementById('pregunta12').value,
      herramientaAdecuadaTrabajo: document.getElementById('pregunta13').value,
      herramientaDañadoPropio: document.getElementById('pregunta14').value,
      sistemaOrganizacion: document.getElementById('pregunta15').value,
      usaCasco: document.getElementById('pregunta16').value,
      usaBotas: document.getElementById('pregunta17').value,
      usaEquipoAltura: document.getElementById('pregunta18').value,
      usaConos: document.getElementById('pregunta19').value,
      fotos: document.getElementById('fotos') ? document.getElementById('fotos').value : '',
      observaciones: document.getElementById('observaciones').value,
      firma: canvas.toDataURL()
    };


console.log(formData);

    // Enviar datos al backend
    fetch('/modelos/respuestasformulario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
      alert('Datos enviados exitosamente');
      // Limpiar formulario y firma 
      // document.getElementById('surveyForm').reset();
      // ctx.clearRect(0, 0, canvas.width, canvas.height);
    })
    .catch(err => {
      alert('Error al enviar datos');
      console.error(err);
    });
  });
});