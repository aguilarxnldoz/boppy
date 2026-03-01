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
                    className="flex flex-col items-center justify-center min-h-[60vh] px-6"
                >
                    <div className="text-center space-y-6 max-w-md">
                        <h3 className="text-2xl font-light">Upload your mp3</h3>
                        <form className="w-full">
                            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-neutral-600 rounded-xl cursor-pointer hover:border-neutral-400 hover:bg-neutral-800/30 transition-all duration-300">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <p className="mb-2 text-sm opacity-70">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs opacity-50">MP3 files only</p>
                                </div>
                                <input
                                    type="file"
                                    accept=".mp3"
                                    className="hidden"
                                    onChange={(event) => handleUpload(event)}
                                ></input>
                            </label>
                        </form>
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
