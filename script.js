// Variables
const apiKey = 'tu_api_key'; // Reemplaza con tu clave real
const city = 'Madrid'; // Ciudad que se desea consultar
const weatherInfo = document.getElementById('weather-info');
const cropList = document.getElementById('crop-list');
const addCropBtn = document.getElementById('crop-form');
const cropNameInput = document.getElementById('crop-name');
const reminderForm = document.getElementById('reminder-form');
const reminderCropInput = document.getElementById('reminder-crop');
const reminderDateInput = document.getElementById('reminder-date');

// Gráfico
const weatherChartCtx = document.getElementById('weatherChart').getContext('2d');
let tempData = [];
let humidityData = [];
let weatherChart = null;

// Pedir permisos para notificaciones
if ('Notification' in window && Notification.permission !== 'granted') {
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      console.log("Permiso concedido para notificaciones");
    }
  });
}

// Función para enviar notificaciones
function enviarNotificacion(titulo, mensaje) {
  if (Notification.permission === 'granted') {
    new Notification(titulo, {
      body: mensaje,
      icon: 'https://image.shutterstock.com/image-vector/sun-cloud-rain-weather-icon-260nw-1156076097.jpg',
      vibrate: [200, 100, 200],
    });
  }
}

// Obtener el clima
function obtenerClima() {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=es`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error al obtener los datos: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log(data); // Depuración: Ver los datos completos de la API

      const temp = data.main.temp;
      const tempMin = data.main.temp_min;
      const tempMax = data.main.temp_max;
      const humidity = data.main.humidity;
      const description = data.weather[0].description;
      const windSpeed = data.wind.speed;
      const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
      const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

      // Mostrar la información meteorológica
      weatherInfo.innerHTML = `
        <p><strong>Temperatura Actual:</strong> ${temp}°C</p>
        <p><strong>Máxima:</strong> ${tempMax}°C | <strong>Mínima:</strong> ${tempMin}°C</p>
        <p><strong>Humedad:</strong> ${humidity}%</p>
        <p><strong>Descripción:</strong> ${description}</p>
        <p><strong>Viento:</strong> ${windSpeed} km/h</p>
        <p><strong>Salida del sol:</strong> ${sunrise}</p>
        <p><strong>Puesta del sol:</strong> ${sunset}</p>
      `;

      // Enviar notificación sobre el clima
      enviarNotificacion('Estado del Clima Actual', `La temperatura es ${temp}°C con un clima ${description}`);

      // Actualizar gráfico
      actualizarGraficoClima();
    })
    .catch(error => {
      console.error('Hubo un error:', error);
      weatherInfo.innerHTML = '<p>No se pudo obtener el clima. Intenta de nuevo.</p>';
    });
}

// Crear gráfico de clima
function actualizarGraficoClima() {
  if (weatherChart) {
    weatherChart.destroy(); // Destruir gráfico previo
  }

  weatherChart = new Chart(weatherChartCtx, {
    type: 'line',
    data: {
      labels: Array.from({ length: tempData.length }, (_, i) => `Día ${i + 1}`),
      datasets: [
        {
          label: '
