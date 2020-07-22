const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

document.addEventListener('DOMContentLoaded', () => {

    const getAllTrainers = () => {
        fetch('http://localhost:3000/trainers')
        .then(res => res.json())
        .then(json => json.forEach(trainer => renderTrainer(trainer)))
    }

    getAllTrainers()

    const renderTrainer = (trainer) => {
        let main = document.querySelector('main')
        let div = createTrainerCardDiv(main, trainer)

        displayName(div, trainer)
        displayAddPokemon(div, trainer)
        displayPokemonList(div, trainer)

        main.appendChild(div)
    }



    // Trainer Card Display - helper methods
    const createTrainerCardDiv = (main, trainer) => {
        let div = document.createElement('div')
        div.className = 'card'
        div.setAttribute("data-id", trainer.id)
        return div
    }

    const displayName = (div, trainer) => {
        let p = document.createElement('p')
        p.innerText = trainer.name
        div.appendChild(p)
    }

    const displayAddPokemon = (div, trainer) => {
        let btn = document.createElement('button')
        btn.setAttribute("data-trainer-id", trainer.id)
        btn.innerText = "Add Pokemon"
        div.appendChild(btn)

        btn.addEventListener('click', (e) => {

            let data = {trainer_id: trainer.id}

            fetch(`http://localhost:3000/pokemons`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(json => {
                let ul = div.querySelector('.pokemon-list')
                addPokemonLi(ul, json)
            })
        })
    }

    const displayPokemonList = (div, trainer) => {
        let ul = document.createElement('ul')
        ul.className = 'pokemon-list'

        trainer.pokemons.forEach(pok => addPokemonLi(ul, pok))
        div.appendChild(ul)
    }

    const addPokemonLi = (ul, pok) => {
        let li = document.createElement('li')
        li.innerHTML = `
            ${pok.species} (${pok.nickname})
            <button class="release" data-pokemon-id="${pok.id}">Release</button>
            `
        ul.appendChild(li)

        // Release Event Listener
        let btn = li.querySelector('.release')
        btn.addEventListener('click', (e) => {
            fetch(`http://localhost:3000/pokemons/${pok.id}`, { method: "DELETE" })
            .then(res => res.json())
            .then(json => {
                li.remove()
            })
        })
    }
})