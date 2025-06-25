document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('signatureCanvas');
  const firmaDataUrl = canvas.toDataURL('image/png');
  
  function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  for (let i = 0; i < n; i++) u8arr[i] = bstr.charCodeAt(i);
  return new File([u8arr], filename, { type: mime });
}

// Antes de enviar el formulario:
const firmaFile = dataURLtoFile(firmaDataUrl, 'firma.png');
formData.append('firma', firmaFile);


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