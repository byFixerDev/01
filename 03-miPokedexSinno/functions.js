// Declaración de variables del DOM
const statusMessage = document.getElementById('status-message');
// Se ha corregido la variable para que coincida con el ID 'card__container'
const pokemonContainer = document.getElementById('card__container'); 
// Se han corregido las variables para que coincidan con los IDs de los botones
const btnJson = document.getElementById('btn__probar-mi-json'); 
const btnPokeapi = document.getElementById('btn-probar-pokeapi');
const btnCoincidences = document.getElementById('btn-coincidences');
const DATA_JSON = './pd-antiguo.json';

// Asignación de event listeners a los botones
btnJson.addEventListener('click', () => {
    fetchData(DATA_JSON, 'json');
});

btnPokeapi.addEventListener('click', () => {
    fetchData('https://pokeapi.co/api/v2/pokemon?limit=20', 'pokeapi');
});

btnCoincidences.addEventListener('click', () => {
    fetchCoincidencesAndCombine();
});

// Función central para la petición de datos
async function fetchData(url, type) {
    try {
        statusMessage.textContent = 'Cargando...';
        pokemonContainer.innerHTML = '';
        await new Promise(resolve => setTimeout(resolve, 1500));

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
        const data = await response.json();
        
        if (type === 'json') {
            // Se llama a una nueva función que manejará la lógica de las imágenes
            await mostrarDatosJSONConImagenes(data);
            statusMessage.textContent = `¡Carga completa! ${data.length} Pokémon cargados desde el JSON.`;
        } else if (type === 'pokeapi') {
            await mostrarDatosPokeAPI(data.results);
            statusMessage.textContent = `¡Carga completa! ${data.results.length} Pokémon cargados desde la PokeAPI.`;
        }
    } catch (error) {
        statusMessage.textContent = `Ha ocurrido un error: ${error.message}`;
        console.error('Error:', error);
    }
}

// NUEVA FUNCIÓN: Muestra los datos del JSON local y carga la imagen de la PokeAPI
async function mostrarDatosJSONConImagenes(data) {
    pokemonContainer.innerHTML = '';
    const total = data.length;

    for (let i = 0; i < total; i++) {
        const pokemon = data[i];
        const pokedexId = obtenerNumeroDePosition(pokemon.Position);
        
        // Verifica si el ID es válido antes de hacer la llamada a la API
        if (pokedexId) {
            try {
                statusMessage.textContent = `Cargando Pokémon ${i + 1} de ${total}...`;
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokedexId}`);
                if (!response.ok) {
                    throw new Error(`No se pudo obtener la imagen del Pokémon con ID ${pokedexId}`);
                }
                const pokeapiData = await response.json();

                pokemonContainer.innerHTML += `
                    <div class="pokemon-card">
                        <h2>${pokemon.Nickname}</h2>
                        <img src="${pokeapiData.sprites.front_default}" alt="Imagen de ${pokemon.Nickname}">
                        <p><strong>ID Pokédex:</strong> <span>${pokedexId}</span></p>
                        <p><strong>Especie:</strong> ${pokemon.Species}</p>
                        <p><strong>Naturaleza:</strong> ${pokemon.Nature}</p>
                        <p><strong>Habilidad:</strong> ${pokemon.Ability}</p>
                    </div>
                `;
            } catch (error) {
                console.error(`Error al cargar la imagen para el Pokémon ${pokemon.Nickname}:`, error);
                pokemonContainer.innerHTML += `
                    <div class="pokemon-card">
                        <h2>${pokemon.Nickname}</h2>
                        <p>Error al cargar la imagen.</p>
                        <p><strong>ID Pokédex:</strong> <span>${pokedexId}</span></p>
                        <p><strong>Especie:</strong> ${pokemon.Species}</p>
                        <p><strong>Naturaleza:</strong> ${pokemon.Nature}</p>
                        <p><strong>Habilidad:</strong> ${pokemon.Ability}</p>
                    </div>
                `;
            }
        }
    }
}


// Función para mostrar los datos de la PokeAPI con contador en vivo
async function mostrarDatosPokeAPI(pokemonList) {
    pokemonContainer.innerHTML = ''; // Limpia el contenedor antes de la carga
    const total = pokemonList.length;

    for (let i = 0; i < total; i++) {
        const item = pokemonList[i];
        statusMessage.textContent = `Cargando Pokémon ${i + 1} de ${total}...`;
        
        const response = await fetch(item.url);
        const data = await response.json();
        
        pokemonContainer.innerHTML += `
            <div class="pokemon-card pokeapi-card">
                <h3>${data.name}</h3>
                <img src="${data.sprites.front_default}" alt="Imagen de ${data.name}">
                <p><strong>ID:</strong> ${data.id}</p>
                <p><strong>Tipo:</strong> ${data.types.map(t => t.type.name).join(', ')}</p>
            </div>
        `;
    }
}

// Función para extraer el número de la posición del JSON local
function obtenerNumeroDePosition(posicionString) {
    const match = posicionString.match(/: (\d{4}) -/);
    return match ? parseInt(match[1]) : null;
}

// Función para cargar, comparar y mostrar los datos entrelazados con contador en vivo
async function fetchCoincidencesAndCombine() {
    try {
        statusMessage.textContent = 'Cargando y comparando...';
        pokemonContainer.innerHTML = '';

        const jsonResponse = await fetch(DATA_JSON);
        if (!jsonResponse.ok) {
            throw new Error(`Error al cargar el JSON: ${jsonResponse.status}`);
        }
        const jsonData = await jsonResponse.json();

        const jsonPokemonMap = new Map();
        jsonData.forEach(p => {
            const id = obtenerNumeroDePosition(p.Position);
            if (id) {
                jsonPokemonMap.set(id, p);
            }
        });

        const pokeapiResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1302');
        if (!pokeapiResponse.ok) {
            throw new Error(`Error al cargar la lista de la PokeAPI: ${pokeapiResponse.status}`);
        }
        const pokeapiData = await pokeapiResponse.json();
        const totalPokemon = pokeapiData.results.length;

        const coincidenciasEncontradas = [];

        for (let i = 0; i < totalPokemon; i++) {
            const item = pokeapiData.results[i];
            const segments = item.url.split('/');
            const pokemonId = parseInt(segments[segments.length - 2]);

            if (jsonPokemonMap.has(pokemonId)) {
                coincidenciasEncontradas.push({
                    pokeapi: item,
                    json: jsonPokemonMap.get(pokemonId)
                });
                statusMessage.textContent = `Buscando coincidencias: ${coincidenciasEncontradas.length} encontradas.`;
            }
        }
        
        let htmlContent = '';
        const totalCoincidencias = coincidenciasEncontradas.length;
        for (let i = 0; i < totalCoincidencias; i++) {
            const match = coincidenciasEncontradas[i];
            
            statusMessage.textContent = `Cargando detalles de ${i + 1} de ${totalCoincidencias} coincidencias...`;
            
            try {
                const detailResponse = await fetch(match.pokeapi.url);
                const pokeapiDetails = await detailResponse.json();

                htmlContent += `
                    <div class="pokemon-card combined-card">
                        <h3>${match.json.Nickname} (${pokeapiDetails.name})</h3>
                        <img src="${pokeapiDetails.sprites.front_default}" alt="Imagen de ${pokeapiDetails.name}">
                        <p><strong>ID Pokédex:</strong> ${pokeapiDetails.id}</p>
                        <p><strong>Especie:</strong> ${match.json.Species}</p>
                        <p><strong>Naturaleza:</strong> ${match.json.Nature}</p>
                        <p><strong>Habilidad:</strong> ${match.json.Ability}</p>
                        <p><strong>Altura:</strong> ${pokeapiDetails.height / 10} m</p>
                        <p><strong>Peso:</strong> ${pokeapiDetails.weight / 10} kg</p>
                        <p><strong>Tipos:</strong> ${pokeapiDetails.types.map(t => t.type.name).join(', ')}</p>
                    </div>
                `;
            } catch (error) {
                console.error(`Error al cargar los detalles del Pokémon con ID ${match.pokeapi.id}:`, error);
            }
        }
        
        pokemonContainer.innerHTML = htmlContent;

        if (totalCoincidencias === 0) {
            statusMessage.textContent = 'No se encontraron coincidencias entre el JSON y la PokeAPI.';
        } else {
            statusMessage.textContent = `¡Carga completa! ${totalCoincidencias} coincidencias encontradas.`;
        }

    } catch (error) {
        statusMessage.textContent = `Ha ocurrido un error: ${error.message}`;
        console.error('Error:', error);
    }
}