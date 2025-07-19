//EJEMPLO de uso fetch con ajax
//el código me lo ha soltado la extensión
//ApiRestClient
const options = {method: 'GET'};

fetch('https://pokeapi.co/api/v2/pokemon/1', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));

  async function obtenerPokemon() {
  try {
    const respuesta = await fetch('https://pokeapi.co/api/v2/pokemon/1');
    const datos = await respuesta.json();
    console.log(datos);
  } catch (error) {
    console.error(error);
  }
}

obtenerPokemon();