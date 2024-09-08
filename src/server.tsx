import {ICharacter} from "./types";
import {renderToString} from "react-dom/server";
import {StaticRouter} from "react-router-dom/server";
import App from "./App";

interface Props {
    path: string;
    characters?: ICharacter[];
    character?: ICharacter;
}

export const render = ({ path, characters, character }: Props) =>
       renderToString(
                <StaticRouter location={path}>
                    <App characters={characters} character={character} />
                </StaticRouter>
        );
