import Header from "./components/header/header";
import UploadMP3 from "./components/upload/upload_mp3";
function App() {
    return (
        <>
            <Header />
            <main className="relative h-screen w-full">
                <div
                    id="main-wrapper"
                    className="h-full w-full"
                >
                    <UploadMP3 />
                </div>
            </main>
        </>
    );
}

export default App;
