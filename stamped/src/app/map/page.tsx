import MapDisplay from "./map_display";

export default function Map() {
    return (
        <div className="flex flex-col">
            <div>Map below:</div>
            <MapDisplay />
        </div>
    );
}