import { User } from "../core/api";
import DeckEdit from "./home/deckedit";
import Matchmaking from "./home/matchmaking";
import NavPage from "./navpage";

export default function Home({ usr }: { usr: User }) {
    return (<>
    <p>{usr.username}</p>
    <NavPage pages={[
        {
            label: "Play",
            page: <Matchmaking/>
        },
        {
            label: "Edit Deck",
            page: <DeckEdit/>
        }
    ]}/></>);
}
