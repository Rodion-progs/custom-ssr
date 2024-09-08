import {useEffect, useState} from "react"
import {useNavigate, useParams} from "react-router-dom"
import {ICharacter} from "../types"

const Character = ({ character }: {character?: ICharacter}) => {

    const [characterState, setCharacterState] = useState<ICharacter | null>(character || null)

    const params = useParams()
    const navigate = useNavigate()
    useEffect(() => {
        if (!window || characterState) {
            return;
        }

        const fetchCharacters = async () => {
            const response = await fetch(`https://rickandmortyapi.com/api/character/${params.id}`)
            const character: ICharacter = await response.json()
            setCharacterState(character)
        }
        fetchCharacters()
    }, [characterState, params.id])

    if (!character && !characterState) return (<div>Loading...</div>)

    const { image, name, status, species, origin, location } = character || characterState;

    return (
            <div className="character-page">
                <h1>{name}</h1>
                <img src={image} alt={name} />
                <p className="status">{status}</p>
                <p className="species">{species}</p>
                {location && <p>Location: {location.name}</p>}
                {origin && <p>Origin: {origin.name}</p>}
                <button onClick={() => navigate("/")}>Back to Characters</button>
            </div>
    )
}

export default Character
