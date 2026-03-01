import {useState, useEffect} from "react";
import BasicBar from "./visualizers/basic_bar";

interface VisualizerProps {
    mp3File: File;
    onUploadNew?: () => void;
    onPlayNext?: () => void;
    hasNext?: boolean;
}

export default function Visualizer({mp3File, onUploadNew, onPlayNext, hasNext}: VisualizerProps) {
    const [audioURL, setAudioURL] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (mp3File) {
            const url = URL.createObjectURL(mp3File);
            setAudioURL(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setAudioURL(undefined);
        }
    }, [mp3File]);

    return (
        <>
            <section
                id="visual-container"
                className="fixed inset-0"
            >
                <BasicBar
                    audioURL={audioURL}
                    onUploadNew={onUploadNew}
                    onPlayNext={onPlayNext}
                    hasNext={hasNext}
                />
            </section>
        </>
    );
}
