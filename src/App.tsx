import {Route, Routes} from "react-router-dom"
import Home from "./pages/Home"
import Character from "./pages/Character"
import Episodes from './pages/Episodes'
import "./index.css"
import {ICharacter} from "./types"
import Navigation from './components/Navigation'

const App = ({characters, character}: {characters?: ICharacter[]; character?: ICharacter}) => {
    return (
        <>
        <Navigation />
            <main className="main-container"></main>
            <Routes>
                <Route index element={<Home characters={characters} />} />
                <Route path="/characters/:id" element={<Character character={character} />} />
                <Route path="/episodes" element={<Episodes />} />
            </Routes>
            </>
    )

}

export default App
