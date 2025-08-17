import {useRef, useEffect, useState} from "react";
import {FaIcon} from "../icons/icons";
import {faPlay, faForward} from "@fortawesome/free-solid-svg-icons";

export default function TrackControls() {
    return (
        <>
            <div
                id="track-controls"
                className="relative w-full m-auto bg-black z-20"
            >
                <div className="track-buttons flex flex-row justify-center py-4">
                    <div className="track-button">
                        <FaIcon icon={faPlay} />
                    </div>
                    <div>
                        <FaIcon icon={faForward} />
                    </div>
                    <div className="track-button">
                        <button>Upload song</button>
                    </div>
                    <div className="track-button">
                        <button>queue song</button>
                    </div>
                </div>
            </div>
        </>
    );
}
