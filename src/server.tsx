import {ICharacter} from "./types";
import {renderToString} from "react-dom/server";
import {StaticRouter} from "react-router-dom/server";
import App from "./App";

interface Props {
    path: string;
    characters?: ICharacter[];
    character?: ICharacter;
}

export type Render = (props: Props) => string;

export const render: Render = ({ path, characters, character }) =>
   renderToString(
        <StaticRouter location={path}>
            <App characters={characters} character={character} />
        </StaticRouter>
    );
