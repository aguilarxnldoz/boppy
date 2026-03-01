export default function Header() {
    return (
        <>
            <header className="w-full absolute z-10 top-0 left-0 p-6">
                <div
                    id="header-headings"
                    className="flex flex-col gap-1"
                >
                    <h1 className="text-6xl font-bold tracking-tight">boppy.</h1>
                    <h2 className="text-sm uppercase tracking-widest opacity-60">Audio Visualizer</h2>
                </div>
            </header>
        </>
    );
}
