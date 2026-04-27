import { useState } from "react";
import { MatchState, socketApi } from "../core/socket";


export default function Match() {
    const [ matchState, setMatchState ] = useState<MatchState | null>(socketApi.getMatchState());

    return (<div>{ matchState && matchState.opponentUsername }</div>);
}
