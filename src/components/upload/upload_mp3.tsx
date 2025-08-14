// import {useState} from "react";

import {useState, useEffect} from "react";

export default function UploadMP3() {
    const [file, setFile] = useState<File | null>(null);
    const [audioURL, setAudioURL] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (file) {
            const url = URL.createObjectURL(file);
            setAudioURL(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setAudioURL(undefined);
        }
    }, [file]);

    return (
        <>
            <section
                id="upload-mp3-section"
                className="border-2 border-dashed border-neutral-400 rounded-2xl p-15 mx-15"
            >
                <h3>Upload your mp3 files here.</h3>
                <form className="my-3">
                    <input
                        type="file"
                        accept=".mp3"
                        className="border-white border-2 rounded-2xl p-5"
                        onChange={(event) => {
                            const selectedFile = event.target.files && event.target.files[0] ? event.target.files[0] : null;
                            setFile(selectedFile);
                            console.log(selectedFile);
                        }}
                    ></input>
                </form>
            </section>
            {file && (
                <audio
                    src={audioURL}
                    controls
                />
            )}
        </>
    );
}
