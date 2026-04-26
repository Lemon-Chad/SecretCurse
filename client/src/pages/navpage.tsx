import { CSSProperties, JSX, useEffect, useState } from "react";
import "../App.css";
import "./navpage.css";

export default function NavPage({ pages, style, onChange }: NavPageProps) {
    const [idx, setIdx] = useState(0);

    return (<div style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'flex-start', 
        alignItems: 'center',
        flex: 1,
        ...(style ? style : {})
    }}>
        <div style={{ 
            width: '75%', 
            overflow: 'hidden', 
            borderRadius: '15px', 
            display: 'flex', 
            flexDirection: 'row', 
            justifyContent: 'center', 
            alignItems: 'center', 
            marginBottom: '1vh' 
        }}>
            {pages.map((page, pageIdx) => (<>
                <a onClick={() => {
                    setIdx(pageIdx);
                    
                    if (onChange)
                        onChange(pageIdx);
                }} key={pageIdx} className={`navButton ${idx == pageIdx && 'activeNavButton'}`}>
                    <div>
                        <p>{page.label}</p>
                    </div>
                </a>
            </>))}
        </div>
        <div>
            {pages[idx].page}
        </div>
    </div>)
}

export type NavPageProps = {
    pages: {
        label: string,
        page: JSX.Element,
    }[];
    style?: CSSProperties;
    onChange?: (idx: number) => void;
};
