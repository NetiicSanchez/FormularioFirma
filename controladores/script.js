// Manejar el formulario
document.getElementById('surveyForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    // Capturar respuestas numéricas
    const pregunta1 = document.getElementById('question1').value;
    const pregunta2 = document.getElementById('question2').value;
  
    // Capturar firma del canvas
    const canvas = document.getElementById('signatureCanvas');
    const signature = canvas.toDataURL();
  
    // Mostrar datos en el dashboard
    updateDashboard([Number(pregunta1), Number(pregunta2)]);
  
    // Mostrar datos en la consola
    const formData = {
      pregunta1: pregunta1,
      pregunta2: pregunta2,
      signature: signature
    };
  
    console.log(formData);
    alert("Datos enviados exitosamente");
  });
  
  // Función para actualizar el dashboard con Chart.js
  function updateDashboard(data) {
    const ctx = document.getElementById('dashboardChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Pregunta1', 'Pregunta2'],
        datasets: [{
          label: 'Respuestas',
          data: data,
          backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)'],
          borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  
  // Funcionalidad del canvas para firma
 const canvas = document.getElementById('signatureCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;

//eventos del mouse para escritorio

canvas.addEventListener('mousedown', (event) => {
  drawing = true;
  ctx.beginPath();
  ctx.moveTo(event.offsetX, event.offsetY);
});
canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mouseleave', () => drawing = false); // Opcional: para evitar errores si sale del canvas
canvas.addEventListener('mousemove', (event) => {
  if (drawing) {
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
  }
});
//eventos táctiles para dispositivos móviles
canvas.addEventListener('touchstart', (event) => {
  event.preventDefault();
  drawing = true;
  const pos = getPosition(event);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
});
canvas.addEventListener('touchend', () => drawing = false);
canvas.addEventListener('touchcancel', () => drawing = false);
canvas.addEventListener('touchmove', (event) => {
  event.preventDefault();
  if (drawing) {
    const pos = getPosition(event);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }
});

document.getElementById('clearSignature').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath(); 
});