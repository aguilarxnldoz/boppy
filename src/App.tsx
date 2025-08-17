import Header from "./components/header/header";
import UploadMP3 from "./components/upload/upload_mp3";
function App() {
    return (
        <>
            <Header />
            <main className="main-view w-auto relative h-full max-h-[100vh]">
                <div
                    id="main-wrapper"
                    className="relative m-auto h-full"
                >
                    <UploadMP3 />
                </div>
            </main>
        </>
    );
}

export default App;
