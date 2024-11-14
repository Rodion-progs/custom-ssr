import {Link} from "react-router-dom"
import {ICharacter} from "../types"
import {useEffect, useState} from "react";

const Home = ({characters}: {characters?: ICharacter[]}) => {
    const [charactersState, setCharactersState] = useState<ICharacter[]>(characters || [])

    console.log(characters, charactersState)

    useEffect(() => {
        if (!window || (charactersState && charactersState?.length !== 0)) {
            return;
        }

        const fetchCharacters = async () => {
            const response = await fetch(`https://rickandmortyapi.com/api/character`)
            const character = await response.json()
            setCharactersState(character.results)
        }
        fetchCharacters()
    }, [charactersState]);

    if (!characters && !charactersState) return (<div>Loading...</div>)

    return (
            <div className="container">
                <h1>Rick and Morty Characters</h1>
                <ul className="cards-grid">
                    {charactersState?.map((character) => (
                            <li className="card" key={character.id}>
                                <img className="card__image" src={character.image} alt={character.name}/>
                                <div className="card__content">
                                    <h2 className="card__title">{character.name}</h2>
                                    <p className="card__text">Species: {character.species}</p>
                                    <p className="card__text">Status: {character.status}</p>
                                    <Link to={`/characters/${character.id}`} className="button card__link">more about {character.name}</Link>
                                </div>
                            </li>
                    ))}
                </ul>
            </div>
    )
}

export default Home
