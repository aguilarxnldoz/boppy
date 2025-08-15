export default function Header() {
    return (
        <>
            <header className="w-full absolute z-10">
                <div
                    id="header-headings"
                    className="w-full flex flex-col gap-1 m-15"
                >
                    <h1 className="text-9xl">boppy.</h1>
                    <h2 className="text-xl italic">Audio Visualizer</h2>
                </div>
            </header>
        </>
    );
}
