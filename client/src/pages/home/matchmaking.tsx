import Button from "../../components/Button";
import { socketApi } from "../../core/socket";
import { useState } from "react";

export default function Matchmaking() {
    const [matchmaking, setMatchmaking] = useState(false);

    return (<>
        <Button label={!matchmaking ? "Search for Game" : "Cancel"} onClick={() => {
            if (matchmaking) {
                socketApi.exitQueue()
                    .then(() => setMatchmaking(false))
                    .catch(() => setMatchmaking(false));
            } else {
                socketApi.enterQueue()
                    .then(() => setMatchmaking(true))
                    .catch(() => setMatchmaking(false));
            }
        }}/>

        <h1>{matchmaking && "Searching for game..."}</h1>
    </>);
}
