// Variables y constantes definidas fuera de la función de evento
const BTN_BULBASAUR = document.getElementById('btn-bulbasaur');
const P = document.querySelector('p'); // Suponiendo que este <p> es para mensajes de estado
const DIV_CONTAINER = document.getElementById('container');
const SPINNER = document.getElementById('loading-spinner');


// Evento de clic para iniciar la carga
BTN_BULBASAUR.addEventListener('click', () => {
    // Es buena práctica limpiar el contenedor antes de una nueva carga
    //PERO NO QUIERO QUE LIMPIE EL DIV, ELIMINA MI SPINNER Y PIKACHU
    //DIV_CONTAINER.innerHTML = '';
    // Llamamos a la función asíncrona, pasando el ID del Pokémon
    obtenerPokemon(1);
});

// Función asíncrona para la petición a la API
async function obtenerPokemon(id) {
    try {
        // Muestra el spinner y un mensaje de carga
        SPINNER.style.display = 'block';
        P.textContent = 'Cargando...';

        // Retrasa la respuesta para simular una conexión lenta
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const URL = `https://pokeapi.co/api/v2/pokemon/${id}`;
        const RESPONSE = await fetch(URL);

        if (!RESPONSE.ok) {
            throw new Error(`Error en la solicitud: ${RESPONSE.status}`);
        }

        const DATA = await RESPONSE.json();
        
        // Oculta el spinner y el mensaje de carga antes de mostrar la tarjeta
        SPINNER.style.display = 'none';
        P.textContent = '';

        mostrarPokemon(DATA);

    } catch (error) {
        // En caso de error, oculta el spinner y muestra un mensaje
        SPINNER.style.display = 'none';
        P.textContent = `Ha ocurrido un error: ${error.message}`;
        console.error('Error:', error);
    }
}

// Función para mostrar la tarjeta de Pokémon
function mostrarPokemon(DATA) {
    // Acceso correcto a los datos de la API, usando el operador ?. para evitar errores
    const tipoPrimario = DATA.types[0]?.type.name || 'N/A';
    const tipoSecundario = DATA.types[1]?.type.name || 'N/A';
    
    // Asigna el HTML completo de la tarjeta al contenedor
    DIV_CONTAINER.innerHTML += `
        <div class="card">
            <img class="card__img" src="${DATA.sprites.other['official-artwork'].front_default}" alt="${DATA.name}">
            <div class="card__datos">
                <p>#${DATA.id.toString().padStart(3, '0')}</p>
                <p>${DATA.name}</p>
            </div>
            <div class="card__tipos">
                <p>${tipoPrimario}</p>
                <p>${tipoSecundario}</p>
            </div>
            <div class="card__medidas">
                <p>${DATA.weight / 10} kg</p>
                <p>${DATA.height / 10} m</p>
            </div>
        </div>
    `;
}
