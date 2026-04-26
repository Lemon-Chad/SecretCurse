import DeckEdit from "./home/deckedit";
import Matchmaking from "./home/matchmaking";
import NavPage from "./navpage";

export default function Home() {
    return (<NavPage pages={[
        {
            label: "Play",
            page: <Matchmaking/>
        },
        {
            label: "Edit Deck",
            page: <DeckEdit/>
        }
    ]}/>);
}
