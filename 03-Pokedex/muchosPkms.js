const BTN_TODOS = document.getElementById('btn-todos');
const SPINNER_TODOS = document.getElementById('loading-spinner');
// Variables y constantes de DOM deben estar fuera del evento
const contenedor = document.getElementById('container');
const mensajeCarga = document.querySelector('p');

BTN_TODOS.addEventListener('click', () => {
  // Llama a la función principal
  obtenerPokemons();
});

async function obtenerPokemons() {
  try {
    // Muestra "Cargando..."
    SPINNER_TODOS.style.display = 'block';
    mensajeCarga.textContent = 'Cargando...';
    
    // Limpia el contenedor antes de la carga
    //contenedor.innerHTML = ''; 

    const promesas = [];
    for (let i = 1; i <= 1025; i++) { // Bucle hasta 10 para probar. 102 es muy lento.
      const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
      promesas.push(fetch(url));
    }

    const respuestas = await Promise.all(promesas);

    // Verificamos que todas las respuestas sean correctas
    for (const respuesta of respuestas) {
      if (!respuesta.ok) {
        throw new Error(`Error en la solicitud: ${respuesta.status}`);
      }
    }

    const datos = await Promise.all(respuestas.map(res => res.json()));

    SPINNER_TODOS.style.display = 'none';
    // Limpiamos el mensaje de carga
    mensajeCarga.textContent = '';

    datos.forEach(pokemonData => {
      mostrarPokemon(pokemonData);
    });

  } catch (error) {
    SPINNER_TODOS.style.display = 'none';
    console.error('Ha ocurrido un error:', error);
    mensajeCarga.textContent = `Error: ${error.message}`;
    contenedor.innerHTML = '';
  }
}

function mostrarPokemon(data) {
  const tipoPrimario = data.types[0]?.type.name || 'N/A';
  const tipoSecundario = data.types[1]?.type.name || 'N/A';

  const tarjetaHTML = `
    <div class="card">
      <img class="card__img" src="${data.sprites.other['official-artwork'].front_default}" alt="${data.name} image">
      <div class="card__datos">
        <p>#${data.id.toString().padStart(3, '0')}</p>
        <p>${data.name}</p>
      </div>
      <div class="card__tipos">
        <p>${tipoPrimario}</p>
        <p>${tipoSecundario}</p>
      </div>
      <div class="card__medidas">
        <p>${data.weight / 10} kg</p>
        <p>${data.height / 10} m</p>
      </div>
    </div>
  `;
  contenedor.innerHTML += tarjetaHTML;
}