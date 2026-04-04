import {useState, useRef} from "react";

import Visualizer from "../visualizer";

export default function UploadMP3() {
    const [queue, setQueue] = useState<File[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(-1);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const currentFile = currentIndex >= 0 ? queue[currentIndex] : null;

    const addToQueue = (file: File) => {
        setQueue((prev) => {
            if (currentIndex === -1) {
                setCurrentIndex(prev.length);
            }
            return [...prev, file];
        });
    };

    const playNext = () => {
        if (currentIndex < queue.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile: File | null = event.target.files && event.target.files[0] ? event.target.files[0] : null;
        if (selectedFile === null) {
            console.error("File could not be uploaded");
            return;
        }
        addToQueue(selectedFile);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            <input
                type="file"
                accept=".mp3"
                className="hidden"
                ref={fileInputRef}
                onChange={(event) => handleUpload(event)}
            ></input>

            {currentIndex === -1 ? (
                <section
                    id="upload-mp3-section"
                    className="flex flex-col items-center justify-center min-h-screen px-6 bg-[#0F172A] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0F172A] to-black text-slate-50 relative overflow-hidden"
                >
                    {/* Background glow effects */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#15B2CE]/10 rounded-full blur-[120px] pointer-events-none"></div>

                    <div className="text-center space-y-10 max-w-3xl z-10">
                        <div className="space-y-4">
                            <h2 className="text-sm md:text-base uppercase tracking-[0.3em] font-bold text-[#15B2CE]">
                                See your music come alive
                            </h2>
                            <h3 className="text-4xl md:text-6xl font-black tracking-tight text-white drop-shadow-sm font-[Righteous]">
                                BREATHTAKING <br className="hidden md:block"/> AUDIO <span className="text-[#15B2CE] drop-shadow-[0_0_15px_rgba(21,178,206,0.6)]">VISUALIZATION</span>
                            </h3>
                            <p className="text-lg text-slate-400 max-w-xl mx-auto pt-4 leading-relaxed font-light">
                                Upload any MP3 file and watch it transform into an immersive audio-reactive experience right in your browser.
                            </p>
                        </div>

                        <form className="w-full max-w-xl mx-auto group">
                            <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-[#15B2CE]/40 bg-slate-900/50 backdrop-blur-xl rounded-2xl cursor-pointer hover:border-[#15B2CE] hover:bg-slate-800/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(21,178,206,0.15)] group-hover:-translate-y-1">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <div className="w-16 h-16 mb-4 rounded-full bg-[#15B2CE]/10 flex items-center justify-center text-[#15B2CE] group-hover:scale-110 group-hover:bg-[#15B2CE]/20 transition-all duration-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                        </svg>
                                    </div>
                                    <p className="mb-2 text-lg text-slate-300">
                                        <span className="font-semibold text-white">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-sm text-slate-500 font-medium">MP3 files only</p>
                                </div>
                                <input
                                    type="file"
                                    accept=".mp3"
                                    className="hidden"
                                    onChange={(event) => handleUpload(event)}
                                ></input>
                            </label>
                        </form>
                        
                        <div className="flex justify-center gap-8 pt-8 opacity-70">
                            <div className="flex flex-col items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#15B2CE]">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                                </svg>
                                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Real-time</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#15B2CE]">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.369 3.75 3.75 0 00-7.332 0c-.634-.84-1.63-1.408-2.738-1.408A4.5 4.5 0 002.25 15z" />
                                </svg>
                                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Client-side</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#15B2CE]">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                                </svg>
                                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">No storage</span>
                            </div>
                        </div>
                    </div>
                </section>
            ) : (
                <Visualizer 
                    mp3File={currentFile!} 
                    onUploadNew={handleUploadClick}
                    onPlayNext={playNext}
                    hasNext={currentIndex < queue.length - 1}
                />
            )}
        </>
    );
}
