import {useEffect, useRef} from "react";

// this canvas element displays the visuals based on the values within the mp3 file
export default function Canvas({mp3File, audioContext, audioURL}: {mp3File: File; audioContext: React.MutableRefObject<AudioContext | null>; audioURL: string | undefined}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // turn the mp3 url into an audio class
    const currentSong: HTMLAudioElement = new Audio(audioURL);

    // pre-define the source and analyzer
    let audioSource: MediaElementAudioSourceNode | undefined;
    let audioAnalyzer: AnalyserNode | undefined;

    useEffect(() => {
        if (!mp3File || !audioContext) console.error("no file bruh");
    }, [mp3File, audioContext]);

    useEffect(() => {
        const canvas = canvasRef.current;
        (canvas as HTMLCanvasElement).width = window.innerWidth;
        (canvas as HTMLCanvasElement).height = window.innerHeight;

        audioSource = audioContext.current?.createMediaElementSource(currentSong);
        audioAnalyzer = audioContext.current?.createAnalyser();
    });

    return (
        <>
            <canvas
                id="visual-canvas"
                className="w-full h-[80vh]"
                ref={canvasRef}
            ></canvas>
        </>
    );
}
