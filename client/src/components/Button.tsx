import { CSSProperties } from "react";
import "../App.css";

export default function Button({ onClick, style, label }: { onClick: () => void; style?: CSSProperties, label: string }) {
    return (<a className="button" style={style} onClick={onClick}>
        <div>{label}</div>
    </a>);
}
