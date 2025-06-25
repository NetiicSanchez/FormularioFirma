document.addEventListener('DOMContentLoaded', function() {
const canvas = document.getElementById('signatureCanvas');



  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let drawing = false;

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

  document.getElementById('clearSignature').addEventListener('click', function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
});

document.getElementById('surveyForm').addEventListener('submit', function(e) {
  const canvas = document.getElementById('signatureCanvas');
  if (!canvas) return;

  // Convierte el canvas a un blob (imagen PNG)
  canvas.toBlob(function(blob) {
    // Crea un nuevo input tipo file
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.name = 'firma';

    // Crea un objeto File a partir del blob
    const file = new File([blob], 'firma.png', { type: 'image/png' });

    // Usa DataTransfer para simular la selección de archivo
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInput.files = dataTransfer.files;

    // Adjunta el input oculto al formulario
    fileInput.style.display = 'none';
    e.target.appendChild(fileInput);

    // Envía el formulario después de agregar el archivo
    e.target.submit();
  });

  // Previene el envío inmediato, lo hará el callback de toBlob
  e.preventDefault();
});