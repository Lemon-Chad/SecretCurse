import Button from "../../components/Button";
import { socketApi } from "../../core/socket";
import { useState } from "react";

export default function Matchmaking() {
    const [ping, setPing] = useState<string>("Not pinged.");

    return (<>
        <Button label="Ping" onClick={() => socketApi.me().then(usr => setPing(usr.username)).catch(err => setPing(err))}/>
        <h1>{ping}</h1>
    </>);
}
