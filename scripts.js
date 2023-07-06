// variables globales
const API_KEY = '7988e38cdeafad1d912e3c3ab218ad65'; // Sustituir si se crea una nueva

function realizarConsulta() {

    // Verificar si entrada es sencilla o multiple
    const entrada = document.getElementById('inputCiudades').value.trim();

    if (entrada.includes(",")) {
        // entrada multiple
        console.log("Entrada multiple...");
        consultarClimas();
    } else {
        // entrada sencilla
        console.log("Entrada sencilla...");
        consultarClima();
    }

}


function consultarClima() {
    const ciudad = document.getElementById('inputCiudades').value;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}`;

    fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Error en la respuesta de la API');
      }
    })
    .then(data => {
      // formar link de imagen como se explica en openweathermap.org
      const url_img = "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"

      // Mostrar resultado en la tabla
      const tabla = document.getElementById('tabla-clima').getElementsByTagName('tbody')[0];
      const fila = tabla.insertRow();
      fila.insertCell().innerHTML = "<img src=\"" + url_img + "\">";
      fila.insertCell().innerHTML = data.name;
      fila.insertCell().innerHTML = `${(data.main.temp - 273.15).toFixed(1)}°C`;
      fila.insertCell().innerHTML = data.weather[0].description;
    })
    .catch(error => {
      console.error('Error al consultar el clima para ' + ciudad +': ', error);
    });

}


function consultarClimas() {
    const ciudades = document.getElementById('inputCiudades').value.split(',').map(ciudad => ciudad.trim());

    Promise.all(ciudades.map(ciudad => {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}`;
        return fetch(url).then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Error en la respuesta de la API');
          }
        });
      }))
      .then(data => {
  
        // Mostrar resultados en la tabla
        const tabla = document.getElementById('tabla-clima').getElementsByTagName('tbody')[0];
        data.forEach(ciudad => {
          // formar link de imagen como se explica en openweathermap.org
          const url_img = "https://openweathermap.org/img/wn/" + ciudad.weather[0].icon + "@2x.png"
  
          const fila = tabla.insertRow();
          fila.insertCell().innerHTML = "<img src=\"" + url_img + "\">";
          fila.insertCell().innerHTML = ciudad.name;
          fila.insertCell().innerHTML = `${(ciudad.main.temp - 273.15).toFixed(1)}°C`;
          fila.insertCell().innerHTML = ciudad.weather[0].description;
        });
      })
      .catch(error => {
        console.error('Error al consultar el clima', error);
      });
        
}


function limpiarDatos() {
    // Borrar tabla
    const tabla = document.getElementById('tabla-clima').getElementsByTagName('tbody');
    for(let i = 0; i<tabla.length; i++)
    {
        tabla[i].innerHTML = "";
    }
    // Borrar campo de entrada
    const entrada = document.getElementById('inputCiudades').value = "";
}
