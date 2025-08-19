import {useRef, useEffect} from "react";
import TrackControls from "../track_controls/track_controls";

export default function CircleVisual({audioURL: string}: {audioURL: string | undefined}) {
    const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
    const audioElementRef = useRef<HTMLMediaElement | null>(null);

    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
    const audioAnalyserRef = useRef<AnalyserNode | null>(null);

    // resize canvas window dimensions
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

    return (
        <>
            <canvas></canvas>
            <TrackControls />
        </>
    );
}
