import {useState} from "react";

import Visualizer from "../visualizer";

export default function UploadMP3() {
    const [step, setStep] = useState<number>(1);
    const [file, setFile] = useState<File | null>(null);

    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile: File | null = event.target.files && event.target.files[0] ? event.target.files[0] : null;
        if (selectedFile === null) console.error("File could not be uploaded jitt!");
        setFile(selectedFile);
        setStep(2);
    };

    return (
        <>
            {step === 1 && (
                <section
                    id="upload-mp3-section"
                    className="border-2 border-dashed border-neutral-400 rounded-2xl p-15 mx-15 w-auto relative top-70"
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
                    <Visualizer mp3File={file!} />
                </>
            )}
        </>
    );
}
