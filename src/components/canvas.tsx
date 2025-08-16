import {useEffect, useRef} from "react";

// this canvas element displays the visuals based on the values within the mp3 file
export default function Canvas({audioURL}: {audioURL: string | undefined}) {
    const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
    const audioElementRef = useRef<HTMLMediaElement | null>(null);

    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
    const audioAnalyserRef = useRef<AnalyserNode | null>(null);

    // resize canvas to window dimensions w/ HiDPI support
    useEffect(() => {
        const canvas = canvasElementRef.current;
        if (!canvas) return;

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            const width = window.innerWidth;
            const height = window.innerHeight;

            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);

            const ctx = canvas.getContext("2d");
            if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    // build the audio graph
    useEffect(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new AudioContext();
            audioSourceRef.current = audioContextRef.current.createMediaElementSource(audioElementRef.current as HTMLMediaElement);
            audioAnalyserRef.current = audioContextRef.current.createAnalyser();

            audioSourceRef.current.connect(audioAnalyserRef.current);
            audioAnalyserRef.current.connect(audioContextRef.current.destination);
        }

        if (audioAnalyserRef.current) {
            audioAnalyserRef.current.fftSize = 64;
        }

        return () => {
            console.log(audioContextRef.current);
            console.log(audioSourceRef.current);
            if (audioSourceRef.current && audioAnalyserRef.current) {
                audioSourceRef.current.disconnect(audioAnalyserRef.current);
            }
        };
    }, [audioElementRef]);

    useEffect(() => {});

    return (
        <>
            <canvas
                id="visual-canvas"
                className="w-full h-[80vh]"
                ref={canvasElementRef}
            ></canvas>
            <audio
                className="w-[75%] absolute top-1 justify-self-center z-11"
                src={audioURL}
                ref={audioElementRef}
                controls
            ></audio>
        </>
    );
}
