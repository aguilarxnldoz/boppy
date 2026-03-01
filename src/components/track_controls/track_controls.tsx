import {useState, type MutableRefObject} from "react";
import {FaIcon} from "../icons/icons";
import {faPlay, faPause, faForward} from "@fortawesome/free-solid-svg-icons";

interface TrackControlsProps {
    audioElementReference: MutableRefObject<HTMLMediaElement | null>;
    onUploadNew?: () => void;
    onPlayNext?: () => void;
    hasNext?: boolean;
}

export default function TrackControls({audioElementReference, onUploadNew, onPlayNext, hasNext}: TrackControlsProps) {
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
                className="absolute bottom-0 left-0 right-0 m-auto bg-black/80 backdrop-blur-md z-20 border-t border-neutral-800"
            >
                <div className="flex flex-row items-center justify-center gap-8 py-4 px-6">
                    <div className="track-button">
                        <button
                            onClick={() => controlPauseAndPlay()}
                            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
                        >
                            <FaIcon icon={songIsPlaying ? faPause : faPlay} />
                        </button>
                    </div>
                    <div className="track-button">
                        <button
                            onClick={onUploadNew}
                            className="text-sm uppercase tracking-wider opacity-60 hover:opacity-100 transition-opacity"
                        >
                            Upload song
                        </button>
                    </div>
                    <div className="track-button">
                        <button
                            onClick={onPlayNext}
                            disabled={!hasNext}
                            className="text-sm uppercase tracking-wider opacity-60 hover:opacity-100 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <FaIcon icon={faForward} />
                            <span>Next</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
