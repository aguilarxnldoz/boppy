import {useRef, useEffect, useState, type MutableRefObject} from "react";
import {FaIcon} from "../icons/icons";
import {faPlay, faForward, faPause} from "@fortawesome/free-solid-svg-icons";

export default function TrackControls({audioElementReference}: {audioElementReference: MutableRefObject<HTMLMediaElement | null>}) {
    const [songIsPlaying, setIsPlaying] = useState<boolean>(false);
    const audioElement = audioElementReference.current as HTMLAudioElement | null;

    const controlPauseAndPlay = () => {
        if (songIsPlaying) {
            audioElement?.pause();
            setIsPlaying(false);
            return;
        }

        audioElement?.play();
        setIsPlaying(true);
        return;
    };

    return (
        <>
            <div
                id="track-controls"
                className="absolute top-1 w-full m-auto bg-black z-20"
            >
                <div className="track-buttons flex flex-row justify-center py-4">
                    <div className="track-button">
                        <button onClick={() => controlPauseAndPlay()}>
                            <FaIcon icon={songIsPlaying ? faPause : faPlay} />
                        </button>
                    </div>
                    <div id="skip-song">
                        <button>
                            <FaIcon icon={faForward} />
                        </button>
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
