import React, { useEffect, useState } from "react";

const Typist = ({ children }) => {

    const [currentStringIdx, updateStrIdx] = useState(0);
    const [currentCharIdx, updateCharIdx] = useState(0);
    console.log(">> ", children, " ", currentStringIdx, " ", currentCharIdx);
    const [currentString, updateDisplayString] = useState(children[currentStringIdx][currentCharIdx]);
    const [showCursor, toggleCursor] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            toggleCursor(!showCursor);
        }, 500);
        return () => clearInterval(interval);
    }, [showCursor]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (currentCharIdx >= children[currentStringIdx].length - 1) {
                updateCharIdx(0);
                updateStrIdx((currentStringIdx + 1) % children.length);
            } else {
                updateCharIdx(currentCharIdx + 1);
            }
            updateDisplayString(children[currentStringIdx].slice(0, currentCharIdx + 1));
        }, 500);
        return () => {
            clearInterval(interval);
        };
    }, [currentStringIdx, currentCharIdx, children]);

    return (
        <div style={{ width: "90%", display: "flex", alignItems: "center" }}>
            <h2 style={{
                color: "black",
                background: "#f1f5a4",
                fontWeight: "300",
                borderRadius: "4px",
                transition: "0.4s ease",
                fontSize: "1.5rem",
                textAlign: "center",
                width: "70%",
                alignSelf: "center"
            }}>
                {currentString}
            </h2>
            <span style={{ transition: "0.3s ease" }}>{showCursor ? "|" : ""}</span>
        </div>
    );
};

export default Typist;
