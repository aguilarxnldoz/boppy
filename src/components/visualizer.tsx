import {useState, useEffect, useRef} from "react";
import Canvas from "./canvas";

export default function Visualizer({mp3File}: {mp3File: File}) {
    const [audioURL, setAudioURL] = useState<string | undefined>(undefined);
    const audioContext = useRef<AudioContext | null>(null);

    useEffect(() => {
        if (mp3File) {
            // audio url to insert into the html audio element
            const url = URL.createObjectURL(mp3File);
            setAudioURL(url);
            // audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
            return () => URL.revokeObjectURL(url);
        } else {
            setAudioURL(undefined);
        }
    }, [mp3File]);

    return (
        <>
            <section
                id="visual-container"
                className="w-auto mt-5"
            >
                <h3 className="ml-5">Currently playing {mp3File.name.slice(0, -4)}</h3>
                <div
                    id="visual-displays"
                    className="w-full h-full absolute"
                >
                    <Canvas
                        mp3File={mp3File}
                        audioContext={audioContext}
                        audioURL={audioURL}
                    />
                </div>
            </section>
        </>
    );
}
