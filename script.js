let correctPokemon;
let options = [];
let score = 0;

// Função para buscar um Pokémon aleatório pela API
async function getRandomPokemon() {
    const randomId = Math.floor(Math.random() * 150) + 1; // Geração 1
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const data = await response.json();
    return data;
}

// Função para gerar uma pergunta
async function generateQuestion() {
    correctPokemon = await getRandomPokemon(); // Pokémon correto
    options = [correctPokemon];

    // Adiciona mais 3 Pokémon
    while (options.length < 4) {
        const randomPokemon = await getRandomPokemon();
        if (!options.some(p => p.name === randomPokemon.name)) {
            options.push(randomPokemon);
        }
    }

    options.sort(() => Math.random() - 0.5); // Embaralha
    displayQuestion();
}

// Exibe a pergunta e opções
function displayQuestion() {
    const pokemonImage = document.getElementById('pokemonImage');
    pokemonImage.src = correctPokemon.sprites.front_default;
    pokemonImage.style.display = 'none'; // Esconde até o tempo da imagem temporária acabar

    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';

    options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = capitalizeFirstLetter(option.name);
        button.onclick = () => checkAnswer(option);
        optionsDiv.appendChild(button);
    });

    // Mostra imagem temporária e, depois, exibe o Pokémon
    showTemporaryImage();
}

// Função para verificar a resposta
function checkAnswer(selected) {
    const resultDiv = document.getElementById('result');
    if (selected.name === correctPokemon.name) {
        resultDiv.innerHTML = '<p><b>Correto!</b></p>';
        score++;
    } else {
        resultDiv.innerHTML = `<p>Incorreto! O Pokémon correto era: ${capitalizeFirstLetter(correctPokemon.name)}</p>`;
    }
    document.getElementById('score').innerText = score;
    document.getElementById('nextButton').style.display = 'block';
}

// Mostra imagem temporária "Qual é o Pokémon?"
function showTemporaryImage() {
    const temp = document.getElementById('qlpokemon');
    const pokemon = document.getElementById('pokemonImage');
    const audio = document.getElementById('quem-é-esse-pokemon');

    audio.currentTime = 0;
    audio.play().catch(error => console.error("Erro ao tocar áudio:", error));

    temp.style.display = 'block'; // Mostra a imagem temporária
    pokemon.style.display = 'none'; // Garante que o Pokémon esteja escondido

    setTimeout(() => {
        temp.style.display = 'none';
        pokemon.style.display = 'block'; // Exibe a imagem do Pokémon
    }, 4000);
}

// Evento no botão "Próximo"
document.getElementById('nextButton').onclick = () => {
    document.getElementById('result').innerHTML = '';
    document.getElementById('nextButton').style.display = 'none';
    generateQuestion();
};

// Inicializa o jogo
window.onload = () => {
    generateQuestion();
};

// Capitaliza o nome do Pokémon
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
