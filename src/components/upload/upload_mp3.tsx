import {useState, useEffect, useRef} from "react";

export default function UploadMP3() {
    const [step, setStep] = useState<number>(1);
    const [file, setFile] = useState<File | null>(null);
    const [audioURL, setAudioURL] = useState<string | undefined>(undefined);
    const audioContext = useRef<AudioContext | null>(null);

    useEffect(() => {
        if (file) {
            // audio url to insert into the html audio element
            const url = URL.createObjectURL(file);
            setAudioURL(url);

            // turn the mp3 file into an arrayBuffer
            const reader: FileReader = new FileReader();
            reader.onload = function (event: ProgressEvent<FileReader>) {
                console.log(event);
            };

            reader.readAsArrayBuffer(file);

            audioContext.current = new (window.AudioContext || window.webkitAudioContext)();

            return () => URL.revokeObjectURL(url);
        } else {
            setAudioURL(undefined);
        }
    }, [file]);

    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile: File | null = event.target.files && event.target.files[0] ? event.target.files[0] : null;
        if (selectedFile === null) console.error("File could not be uploaded jitt!");
        setFile(selectedFile);
        console.log(selectedFile);
        setStep(2);
    };

    return (
        <>
            {step === 1 && (
                <section
                    id="upload-mp3-section"
                    className="border-2 border-dashed border-neutral-400 rounded-2xl p-15 mx-15 w-auto"
                >
                    <h3>Upload your mp3 files here.</h3>
                    <form className="my-3 w-auto">
                        <input
                            type="file"
                            accept=".mp3"
                            className="border-white border-2 rounded-2xl p-5 w-auto"
                            onChange={(event) => handleUpload(event)}
                        ></input>
                    </form>
                </section>
            )}

            {step === 2 && file && (
                <>
                    <h2>{file.name}</h2>
                    <audio
                        src={audioURL}
                        controls
                    />
                </>
            )}
        </>
    );
}
