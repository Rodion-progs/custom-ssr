import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ICharacter } from "../types.ts";

interface Episode {
    id: number
    name: string
    episode: string
    air_date: string
    characters: string[]
    charactersData?: ICharacter[]
}

export default function Episodes() {
    const [episodes, setEpisodes] = useState<Episode[]>([])
    const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null)
    const [loading, setLoading] = useState(true)
    const [loadingDetails, setLoadingDetails] = useState(true)

    useEffect(() => {
        fetchEpisodes();
    }, [])

    const fetchEpisodes = async () => {
        try {
            const response = await fetch('https://rickandmortyapi.com/api/episode')
            const data = await response.json()
            setEpisodes(data.results)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching episodes:', error)
            setLoading(false)
        }
    }

    const fetchEpisodeDetails = async (episode: Episode) => {
        try {
            setLoadingDetails(true)
            const charactersData = await Promise.all(
                    episode.characters.map(url =>
                            fetch(url).then(res => res.json())
                    )
            )
            setSelectedEpisode({ ...episode, charactersData })
        } catch (error) {
            console.error('Error fetching episode details:', error)
        } finally {
            setLoadingDetails(false)
        }
    }

    if (loading) {
        return <div className="container">Loading...</div>
    }

    return (
        <div className="container">
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
                Rick and Morty Episodes
            </h1>

            <div className="cards-grid">
                {episodes.map(episode => (
                    <div
                            key={episode.id}
                            className="button"
                            onClick={() => fetchEpisodeDetails(episode)}
                            style={{ cursor: 'pointer' }}
                    >
                        <div className="card__content">
                            <h2 className="card__title">{episode.name}</h2>
                            <p className="card__text">Episode: {episode.episode}</p>
                            <p className="card__text">Air Date: {episode.air_date}</p>
                        </div>
                    </div>
                ))}
            </div>

            {selectedEpisode && (
                <div style={{ marginTop: '2rem' }}>
                    <h2>{selectedEpisode.name}</h2>
                    <p className="status">Episode: {selectedEpisode.episode}</p>
                    <p className="species">Air Date: {selectedEpisode.air_date}</p>

                    <h3 style={{ marginTop: '2rem' }}>Characters in this episode:</h3>
                    <div className="cards-grid">
                        {selectedEpisode.charactersData?.map(character => (
                            <div
                                    key={character.id}
                                    className="card"
                            >
                                <img
                                        src={character.image}
                                        alt={character.name}
                                        className="card__image"
                                />
                                <div className="card__content">
                                    <h3 className="card__title">{character.name}</h3>
                                    <p className="card__text">Status: {character.status}</p>
                                    <Link to={`/characters/${character.id}`} className="button card__link">more about {character.name}</Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => setSelectedEpisode(null)}
                        style={{ marginTop: '2rem' }}
                    >
                        Back to Episodes
                    </button>
                </div>
            )}
        </div>
    )
}
