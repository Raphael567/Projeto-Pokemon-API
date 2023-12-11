const BASEURL = 'https://pokeapi.co/api/v2/pokemon/?limit=251'

let telaEscuraAtiva = false
let contPokemon = 6

let listaPokemon = []
let pokemonsCapturados = []
let pokemonDetail = []

//Faço a requisição
function getPokemonById(){
    fetch(BASEURL).then((response) => {
        return response.json()
    })
        .then((json) => {
            listaPokemon = json.results
            renderPokemon()
        })
}

//Dou .map no array e consigo cada pokemon detalhadamente
function renderPokemon(){
    const listaElemento = document.getElementById("showPokemon")

    listaPokemon.map((pokemon) => {
        getPokemonDetails(pokemon.url, listaElemento)
    })
}

//Filtro os detalhes
function getPokemonDetails(url, listaElemento){
    fetch(url).then((response) => {
        return response.json()
    })
        .then((pokemon) => {
            renderPokemonInfo(pokemon, listaElemento)
        })
}

//Filtrando pra lista de pokemons capturados
function renderPokemonCapturado(){
    if(pokemonsCapturados.length <= 6){
        const listaElemento2 = document.getElementById("showPokemonCaptured")
    
        listaElemento2.innerHTML = ""
    
        pokemonsCapturados.map((pokemon) => {
            renderPokemonCapturadosInfo(pokemon, listaElemento2)
        })
    } else{
        removePokemon()
    }
}

//Filtrando pra lista de detalhes
function renderPokemonDetails(){
    const listaElemento3 = document.getElementById("pokemon")

    listaElemento3.innerHTML = ""

    pokemonDetail.map((pokemon) => {
        renderPokemonDetailsInfo(pokemon, listaElemento3)
    })
}

//Exibo no html
function renderPokemonInfo(pokemon, listaElemento){
    const showPokemonImg = createImage(pokemon.sprites.front_default)
    const showPokemonName = createParagraph(pokemon.name)
    const showPokemonId = createParagraph(`# ${pokemon.id}`)
    const showPokemonClassification = createParagraph(pokemon.types[0].type.name)
    const capturePokemon = createButton("Capturar", () => capturarPokemon(pokemon))
    const pokemonDetailBt = createButton("Detalhes", () => showPokemonDetails(pokemon))
    
    const showPokemons = document.createElement("li")
    
    appendChildren(showPokemons, showPokemonId, showPokemonImg, showPokemonName, showPokemonClassification, capturePokemon, pokemonDetailBt)
    listaElemento.appendChild(showPokemons)

    showPokemonClassification.classList.add("pokemon-type")
    showPokemonName.classList.add("pokemon-name")
    showPokemonId.classList.add("pokemon-id")
}

//Exibo pokemons capturados
function renderPokemonCapturadosInfo(pokemon, listaElemento2){
    const showPokemons = document.createElement("li")
    const showPokemonName = createParagraph(pokemon.name)
    const showPokemonImg = createImage(pokemon.sprites.front_default)
    const removerPokemon = createButton("Remover", () => removePokemon(pokemon))

    showPokemonImg.src = pokemon.sprites.front_default
    removerPokemon.innerHTML = "Remover"
    
    appendChildren(showPokemons, showPokemonImg, showPokemonName, removerPokemon);
    listaElemento2.appendChild(showPokemons)

}

//Exibo no HTML os detalhes do pokemón
function renderPokemonDetailsInfo(pokemon, listaElemento3){
    const hideButton = createButton("X", hideDiv)

    const showPokemonImg = createImage(pokemon.sprites.front_default)
    const showPokemonName = createListItem(`Nome: ${pokemon.name}`)
    const showPokemonWeight = createListItem(`Peso: ${pokemon.weight}`)
    const showPokemonHP = createListItem(`HP: ${pokemon.stats[0].base_stat}`)
    const showPokemonAbilities = createListItem(`Movimentos: ${pokemon.abilities.map(ability => ability.ability.name).join(', ')}`)
    const showPokemonClassification = createListItem(`Tipo: ${pokemon.types.map(type => type.type.name).join(', ')}`)

    const showPokemons = document.createElement("li")

    appendChildren(showPokemons, showPokemonImg, showPokemonName, showPokemonClassification, showPokemonHP, showPokemonWeight, showPokemonAbilities);

    listaElemento3.appendChild(hideButton)
    listaElemento3.appendChild(showPokemons);
    hideButton.classList.add("esconder-div")
}

//Capturar Pokémon
function capturarPokemon(pokemon) {
    /*
        !pokemonsCapturados.includes(pokemon)

        Com isso conseguimos verficar se há a presença do objeto 'pokemón', onde o método includes
        retorna true se o objeto estiver no array, caso contrário, retorna false

        Bascimente com o '!' nós invertemos o valor dessa condição, retornando true se NÃO houver a presença
        do objeto pokemón, caso contrário, retorna false se o pokemón estiver presente
    */
    if(pokemonsCapturados.length <= 6 && !pokemonsCapturados.includes(pokemon)){
        pokemonsCapturados.push(pokemon)
        renderPokemonCapturado()
        if(contPokemon != 0){
            contPokemon--
            alert(`Pokémon adicionado ao time! Espaço restante: ${contPokemon}`)
        }
    } else if(pokemonsCapturados.length <= 6 && pokemonsCapturados.includes(pokemon)){
        alert("Não é possível adicionar o mesmo pokémon no time!")
    } else{
        alert("Time cheio!")
    }
}

//Remover o pokemón capturado
function removePokemon(pokemon){
    const index = pokemonsCapturados.indexOf(pokemon)

    if (index !== -1){
        if(pokemonsCapturados.length <= 6){
            contPokemon++
            alert(`Pokémon removido, +1 espaço fornecido`)
            pokemonsCapturados.splice(index, 1)
            renderPokemonCapturado()
        } else{
            pokemonsCapturados.pop()
            renderPokemonCapturado()
        }
    }
}

//Eixbir os detalhes na tela ao clicar no botão, além de limitar apenas a um pokémon
function showPokemonDetails(pokemon) {
    if(!pokemonDetail.includes(pokemon)){
        pokemonDetail.push(pokemon)
        renderPokemonDetails()
        escurecerTela()
        removeEventListener('click', hideDiv())
        pokemonDetail.pop(pokemon)
    }
}

//Esconder a div que exibe os detalhes dos pokemóns
function hideDiv(){
    let container = document.querySelector('.showPokemonDetail')
    
    if(container.style.display === 'block') {
        container.style.display = 'none'
        telaEscuraAtiva = true;
        
    } else{
        container.style.display = 'block'
        telaEscuraAtiva = false;
    }
    escurecerTela()
}

function escurecerTela(){
    const overlay = document.getElementById("overlay")

    if(telaEscuraAtiva){
        overlay.style.display = 'none'
    } else {
        overlay.style.display = 'block'
    }
}

//Funções que criam elementos e economizam espaço no meu código
function createListItem(text){
    const li = document.createElement("li")
    li.innerHTML = text
    return li
}

function createImage(src) {
    const img = document.createElement("img")
    img.src = src
    return img
}

function createParagraph(text){
    const p = document.createElement("p")
    p.innerHTML = text
    return p
}

function createButton(text, onClick){
    const button = document.createElement("button")
    button.innerText = text
    button.onclick = onClick
    return button
}

/*
    Parent -> Elemento pai no qual adicionamos filhos
    ...children -> Número variável de argumentos, representando os elementos que desejamos adiconar
    no elemento pai

    iteramos com o .map cada elemento na nossa lista children, depois adicionamos ao elemento pai com o
    appendChild()
*/
function appendChildren(parent, ...children) {
    children.map(child => parent.appendChild(child));
}

//Rodando a API
getPokemonById()



// /*
// let array = [1,2,3,4]

// array.indexOf(2) -> 3
// let array = [1,2,null,4]

// array.splice(index,1)

// dot notation -> capturado[""][""][""]
// */