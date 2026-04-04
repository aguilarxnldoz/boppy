import Header from "./components/header/header";
import UploadMP3 from "./components/upload/upload_mp3";

function App() {
    return (
        <div className="bg-[#0F172A] min-h-screen text-slate-50 font-[Poppins]">
            <Header />
            <main className="relative min-h-screen w-full">
                <div
                    id="main-wrapper"
                    className="h-full w-full"
                >
                    <UploadMP3 />
                </div>
            </main>
        </div>
    );
}

export default App;
