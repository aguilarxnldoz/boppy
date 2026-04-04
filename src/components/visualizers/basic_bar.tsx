import {useEffect, useRef} from "react";
import TrackControls from "../track_controls/track_controls";

interface BasicBarProps {
    audioURL: string | undefined;
    onUploadNew?: () => void;
    onPlayNext?: () => void;
    hasNext?: boolean;
}

export default function BasicBar({audioURL, onUploadNew, onPlayNext, hasNext}: BasicBarProps) {
    const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
    const audioElementRef = useRef<HTMLAudioElement | null>(null);

    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
    const audioAnalyserRef = useRef<AnalyserNode | null>(null);

    const dataArrayRef = useRef<Uint8Array | null>(null);
    const animationRef = useRef<number | null>(null);

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
        };

        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    // build the audio graph and stunning visuals
    useEffect(() => {
        const element = audioElementRef.current;
        const canvas = canvasElementRef.current;
        if (!element || !canvas) return;

        const handlePlay = () => {
            if (!audioContextRef.current) {
                // Using standard AudioContext, fallback for safari if needed
                const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
                audioContextRef.current = new AudioCtx();
                
                audioSourceRef.current = audioContextRef.current.createMediaElementSource(element);
                audioAnalyserRef.current = audioContextRef.current.createAnalyser();

                audioSourceRef.current.connect(audioAnalyserRef.current);
                audioAnalyserRef.current.connect(audioContextRef.current.destination);
                
                // Higher fftSize for more detailed frequency data
                audioAnalyserRef.current.fftSize = 1024;
                audioAnalyserRef.current.smoothingTimeConstant = 0.85;
            }

            const analyser = audioAnalyserRef.current;
            if (!analyser) return;

            const bufferLength = analyser.frequencyBinCount;
            if (!dataArrayRef.current) {
                dataArrayRef.current = new Uint8Array(bufferLength);
            }

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            // Particles for ambient background
            const particles: {x: number, y: number, speed: number, size: number, alpha: number}[] = [];
            for (let i = 0; i < 100; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    speed: 0.5 + Math.random() * 2,
                    size: Math.random() * 3,
                    alpha: Math.random() * 0.5
                });
            }

            const animate = () => {
                if (!canvasElementRef.current) return;
                
                const width = canvas.width;
                const height = canvas.height;
                const centerX = width / 2;
                const centerY = height / 2;

                // Clear with slight trailing effect (motion blur)
                ctx.fillStyle = "rgba(15, 23, 42, 0.25)";
                ctx.fillRect(0, 0, width, height);

                analyser.getByteFrequencyData(dataArrayRef.current as Uint8Array);
                const data = dataArrayRef.current!;

                // Calculate average volume for pulse effects
                let sum = 0;
                for (let i = 0; i < bufferLength; i++) {
                    sum += data[i];
                }
                const avgVolume = sum / bufferLength;
                const pulseRadius = (avgVolume / 255) * (Math.min(width, height) * 0.2);

                // Draw ambient particles that react to beat
                particles.forEach(p => {
                    p.y -= p.speed * (1 + avgVolume / 50);
                    if (p.y < 0) {
                        p.y = height;
                        p.x = Math.random() * width;
                    }
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * (1 + avgVolume / 100), 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(21, 178, 206, ${p.alpha})`;
                    ctx.fill();
                });

                // Central glowing orb
                const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 100 + pulseRadius);
                gradient.addColorStop(0, "rgba(21, 178, 206, 0.4)");
                gradient.addColorStop(1, "rgba(21, 178, 206, 0)");
                
                ctx.beginPath();
                ctx.arc(centerX, centerY, 100 + pulseRadius, 0, 2 * Math.PI);
                ctx.fillStyle = gradient;
                ctx.fill();

                // Draw circular frequency bars symmetrically
                const totalBars = 120;
                const halfBars = totalBars / 2;
                const baseRadius = 120 + pulseRadius;

                for (let i = 0; i < halfBars; i++) {
                    // Use a step of 2 to sample the more active lower frequencies
                    // (since higher frequencies are mostly 0 in typical music files)
                    const value = data[i * 2];
                    const barHeight = (value / 255) * (Math.min(width, height) * 0.25);
                    
                    const hue = 190 + (i / halfBars) * 30; // Variations of #15B2CE
                    const lightness = 40 + (value / 255) * 30;
                    
                    const drawBar = (angle: number) => {
                        const x1 = centerX + Math.cos(angle) * baseRadius;
                        const y1 = centerY + Math.sin(angle) * baseRadius;
                        const x2 = centerX + Math.cos(angle) * (baseRadius + barHeight);
                        const y2 = centerY + Math.sin(angle) * (baseRadius + barHeight);

                        ctx.beginPath();
                        ctx.moveTo(x1, y1);
                        ctx.lineTo(x2, y2);
                        ctx.strokeStyle = `hsla(${hue}, 100%, ${lightness}%, 0.8)`;
                        ctx.lineWidth = Math.max(2, (width / totalBars) * 0.4);
                        ctx.lineCap = "round";
                        ctx.stroke();

                        // Optional: Draw a dot at the end of some bars for extra flare
                        if (value > 150) {
                            ctx.beginPath();
                            ctx.arc(x2 + Math.cos(angle) * 5, y2 + Math.sin(angle) * 5, 3, 0, Math.PI * 2);
                            ctx.fillStyle = `hsla(${hue}, 100%, 70%, 0.9)`;
                            ctx.fill();
                            
                            // Add glow
                            ctx.shadowBlur = 10;
                            ctx.shadowColor = `hsla(${hue}, 100%, 50%, 0.8)`;
                        } else {
                            ctx.shadowBlur = 0;
                        }
                    };

                    // Draw right side (from bottom to top)
                    const angleRight = Math.PI / 2 - (i * Math.PI) / halfBars;
                    drawBar(angleRight);

                    // Draw left side (from bottom to top)
                    if (i > 0) {
                        const angleLeft = Math.PI / 2 + (i * Math.PI) / halfBars;
                        drawBar(angleLeft);
                    }
                }
                
                // Reset shadow blur
                ctx.shadowBlur = 0;

                // Draw a beautiful sine wave representing time domain
                const timeData = new Uint8Array(bufferLength);
                analyser.getByteTimeDomainData(timeData);
                
                ctx.beginPath();
                for (let i = 0; i < bufferLength; i++) {
                    const v = timeData[i] / 128.0;
                    const radius = baseRadius * 0.8 * v;
                    
                    const angle = (i * 2 * Math.PI) / bufferLength - Math.PI / 2;
                    const x = centerX + Math.cos(angle) * radius;
                    const y = centerY + Math.sin(angle) * radius;
                    
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.closePath();
                ctx.lineWidth = 2;
                ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
                ctx.stroke();

                animationRef.current = requestAnimationFrame(animate);
            };

            // Start animation loop
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            animate();
            
            // Ensure audio context is running (fixes Safari auto-play policy issues)
            if (audioContextRef.current.state === 'suspended') {
                audioContextRef.current.resume();
            }
        };

        element.addEventListener("play", handlePlay);

        return () => {
            element.removeEventListener("play", handlePlay);
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [audioURL]);

    return (
        <>
            <canvas
                id="visual-canvas"
                className="fixed inset-0 w-full h-full bg-[#0F172A]"
                ref={canvasElementRef}
            ></canvas>
            <audio
                className="hidden"
                src={audioURL}
                ref={audioElementRef}
                autoPlay
            ></audio>
            <TrackControls
                audioElementReference={audioElementRef}
                onUploadNew={onUploadNew}
                onPlayNext={onPlayNext}
                hasNext={hasNext}
            />
        </>
    );
}
