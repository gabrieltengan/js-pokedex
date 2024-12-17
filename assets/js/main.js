const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");

const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
  return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types
                      .map((type) => `<li class="type ${type}">${type}</li>`)
                      .join("")}

                    <button  
                      class="type ${pokemon.type}" 
                     
                      data-number="${pokemon.number}" 
                      data-name="${pokemon.name}" 
                    
                      class="modalBtn" >
                      details
                    </button>
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToLi).join("");
    pokemonList.innerHTML += newHtml;
    attachModalEvents()
  });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener("click", () => {
  offset += limit;
  const qtdRecordsWithNexPage = offset + limit;

  if (qtdRecordsWithNexPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);

    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit);
  }
});

function attachModalEvents() {
  const modalButtons = document.querySelectorAll(
    ".pokemon .type[data-number][data-name]"
  ); // Seleciona os botões de detalhe
  modalButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const pokemonNumber = event.target.getAttribute("data-number");
      const pokemonName = event.target.getAttribute("data-name");
      const pokemonTypes = Array.from(
        event.target.closest("ol").querySelectorAll(".type")
      ).map((typeElement) => typeElement.textContent.trim());
      const pokemonImage = event.target
        .closest(".detail")
        .querySelector("img").src;

      // Busca os detalhes completos do Pokémon diretamente pela API
      pokeApi
        .getPokemonDetail({
          url: `https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`,
        })
        .then((pokemon) => {
          // Preenche a modal com os detalhes do Pokémon
          document.getElementById(
            "modal-number"
          ).textContent = `#${pokemon.number}`;
          document.getElementById(
            "modal-name"
          ).textContent = `${pokemon.name}`;
          document.getElementById("modal-image").src = pokemon.photo;
          document.getElementById(
            "modal-image"
          ).alt = `Imagem de ${pokemon.name}`;
          document.getElementById("modal-types").innerHTML = pokemon.types
            .map(
              (type) => `<li class="type ${type.toLowerCase()}">${type}</li>`
            )
            .join("");

          // Adiciona os stats (status) à modal
          document.getElementById("modal-stats").innerHTML = pokemon.stats
            .map(
              (stat) => `<li class="status-content"><strong>${stat.name}:</strong> <span class="status-value">${stat.value}</span></li>
      
              `
            )
            .join("");
            

          // Exibe a modal
          document.getElementById("pokemon-modal").style.display = "block";
          document.getElementsByClassName("pokemon-modal::before").style.backgroundColor = types;
        });
    });
  });
}

attachModalEvents();

document.getElementById("close-modal").addEventListener("click", () => {
  document.getElementById("pokemon-modal").style.display = "none";
});
