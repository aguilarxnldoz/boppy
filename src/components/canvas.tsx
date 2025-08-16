import {useEffect, useRef} from "react";

// this canvas element displays the visuals based on the values within the mp3 file
export default function Canvas({mp3File, audioURL}: {mp3File: File; audioURL: string | undefined}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const processedFileRef = useRef<File | null>(null);
    const currentSong: HTMLAudioElement = new Audio(audioURL);
    const audioContext = new AudioContext();

    const audioSource: MediaElementAudioSourceNode | undefined = audioContext?.createMediaElementSource(currentSong);
    const audioAnalyzer: AnalyserNode | undefined = audioContext?.createAnalyser();

    // sets the canvas dimensions
    useEffect(() => {
        const canvas = canvasRef.current;
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

    // gets the audio source (mp3 file) to the destination (to ur speakers);
    useEffect(() => {
        audioSource?.connect(audioAnalyzer as AudioNode);
        audioAnalyzer?.connect(audioContext?.destination as AudioNode);

        void currentSong.play();

        return () => {
            try {
                audioSource?.disconnect();
                audioAnalyzer?.disconnect();
            } catch (e) {
                console.error(e);
            }
        };
    }, [mp3File, audioURL]);

    // 🔥 reads the mp3 file and controls the visuals
    useEffect(() => {
        if (processedFileRef.current === mp3File) return;

        const reader = new FileReader();

        // once the mp3 file is loaded the buffer array is read and visuals are controlled
        reader.onload = function (event: ProgressEvent<FileReader>) {
            console.log("YOOOOOO", event);
            const arrayBuffer = event?.target?.result;
            console.log(audioAnalyzer.fftSize, arrayBuffer);

            audioAnalyzer.fftSize = 64;
            // const dataArray = new Uint8Array();
        };

        return () => reader.readAsArrayBuffer(mp3File);
    }, [mp3File]);

    return (
        <>
            <canvas
                id="visual-canvas"
                className="w-full h-[80vh]"
                ref={canvasRef}
            ></canvas>
            <audio
                className="w-[75%] absolute top-1 justify-self-center"
                src={audioURL}
                controls
            ></audio>
        </>
    );
}
