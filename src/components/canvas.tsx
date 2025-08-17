import {useEffect, useRef} from "react";

// this canvas element displays the visuals based on the values within the mp3 file
export default function Canvas({audioURL}: {audioURL: string | undefined}) {
    const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
    const audioElementRef = useRef<HTMLMediaElement | null>(null);

    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
    const audioAnalyserRef = useRef<AnalyserNode | null>(null);

    const dataArrayRef = useRef<Uint8Array | null>(null);

    // resize canvas to window dimensions w/ HiDPI support
    useEffect(() => {
        const canvas = canvasElementRef.current;
        if (!canvas) return;

        const resize = () => {
            const dpr: number = window.devicePixelRatio || 1;
            const width: number = window.innerWidth;
            const height: number = window.innerHeight;

            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);

            const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
            if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    // build the audio graph
    useEffect(() => {
        const element = audioElementRef.current as HTMLAudioElement;
        const canvas: HTMLCanvasElement | null = canvasElementRef.current;
        const ctx: CanvasRenderingContext2D | null | undefined = canvasElementRef.current?.getContext("2d");
        if (!element) return;

        // this is where this the visuals are made using Canvas API and Web Audio API
        element.onplay = () => {
            if (!audioContextRef.current) {
                audioContextRef.current = new AudioContext();
                audioSourceRef.current = audioContextRef.current.createMediaElementSource(audioElementRef.current as HTMLMediaElement);
                audioAnalyserRef.current = audioContextRef.current.createAnalyser();

                audioSourceRef.current.connect(audioAnalyserRef.current);
                audioAnalyserRef.current.connect(audioContextRef.current.destination);
            }

            if (audioAnalyserRef.current) {
                audioAnalyserRef.current.fftSize = 512;
            }

            const analyser = audioAnalyserRef.current;
            if (analyser && !dataArrayRef.current) {
                const bufferLength: number = analyser.frequencyBinCount;
                dataArrayRef.current = new Uint8Array(bufferLength);

                // fftSize / 2 (the value is 32 in my case)
                const barWidth: number = ((canvasElementRef.current?.width as number) / bufferLength) * 1.5;

                // bar height is constantly changing as values from music track are playing
                let barHeight: number;

                const animate = () => {
                    // represent x-coordinate of each visual bar
                    let visualBarXcoordinate = 0;
                    ctx?.clearRect(0, 0, canvas?.width as number, canvas?.height as number);
                    analyser.getByteFrequencyData(dataArrayRef.current as Uint8Array<ArrayBuffer>);

                    for (let i: number = 0; i < bufferLength; i++) {
                        barHeight = dataArrayRef.current ? dataArrayRef.current[i] * 3 : 0;
                        (ctx as CanvasRenderingContext2D).fillStyle = "white";
                        (ctx as CanvasRenderingContext2D).fillRect(visualBarXcoordinate, (canvas?.height as number) - barHeight, barWidth, barHeight);

                        visualBarXcoordinate += barWidth;
                    }
                    requestAnimationFrame(animate);
                };
                animate();
            }
        };

        return () => {
            if (audioSourceRef.current && audioAnalyserRef.current) {
                audioSourceRef.current.disconnect(audioAnalyserRef.current);
            }
        };
    }, [audioElementRef]);

    return (
        <>
            <canvas
                id="visual-canvas"
                className="w-full"
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
