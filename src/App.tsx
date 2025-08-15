import Header from "./components/header/header";
import UploadMP3 from "./components/upload/upload_mp3";
function App() {
    return (
        <>
            <Header />
            <main className="main-view w-auto relative">
                <div className="main-view relative m-auto">
                    <UploadMP3 />
                </div>
            </main>
        </>
    );
}

export default App;
