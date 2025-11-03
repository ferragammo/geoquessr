import { useState, useRef, useEffect } from "react";
import { YMaps, Map, Placemark, FullscreenControl, Polyline } from "react-yandex-maps";
import { calculateDistanceBeetweenCoords, calculateCenterBeetweenCoords } from "../../../Utils/distanceBetweenTwoMarkers";

const settingsOfYMap = {
    defaultCenter: [0, 0],
    defaultZoom: 1, 
    worldBounds: [[-85, -179.99], [85, 180]],
};

const calculateZoom = (distance) => {
    const initialZoom = 7.5; 
    const zoomStep = 0.2; 
    const maxDistanceStep = 70;
    return Math.max(1, initialZoom - Math.floor(distance / maxDistanceStep) * zoomStep); 
};

const Ymap = ({ coordOfCurrentPlace, onResult, onPauseTimer, isTimeOver }) => {
    const [markerOfUser, setMarkerCoords] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const mapRef = useRef(null);

    const checkResult = () => {
        setShowResult(true);
        onPauseTimer();
        const distance = calculateDistanceBeetweenCoords(coordOfCurrentPlace, markerOfUser);
        const center = calculateCenterBeetweenCoords(coordOfCurrentPlace, markerOfUser);

        const zoom = calculateZoom(distance);

        if (mapRef.current) {
            mapRef.current.setZoom(zoom);
            mapRef.current.setCenter(center);
        }

        onResult(distance, true);
    };

    const handleMapClick = (event) => {
        if (!showResult && !isTimeOver) {
            const coords = event.get("coords");
            setMarkerCoords(coords);
        }
    };

    useEffect(() => {
        if (isTimeOver && !markerOfUser) {
            if (mapRef.current) {
                mapRef.current.setZoom(3);
                mapRef.current.setCenter(coordOfCurrentPlace);
            }
        } else if (isTimeOver && markerOfUser) {
            checkResult();
        }
    }, [isTimeOver, markerOfUser]);

    return (
        <div className={`g_page_main_container_for_map ${showResult || isTimeOver ? 'g_page_main_container_checked' : ''}`}>
            <div className={`g_page_container_for_map ${markerOfUser ? 'g_page_container_shifted' : ''}`}>
                <YMaps>
                    <Map
                        instanceRef={mapRef}
                        defaultState={{ center: settingsOfYMap.defaultCenter, zoom: settingsOfYMap.defaultZoom }}
                        onClick={handleMapClick}
                        width="100%"
                        height="100%"
                        options={{
                            restrictMapArea: settingsOfYMap.worldBounds,
                            suppressMapOpenBlock: true,
                        }}
                    >
                        <FullscreenControl />
                        {markerOfUser && (
                            <Placemark geometry={markerOfUser} options={{ preset: "islands#blueDotIcon" }} />
                        )}
                        {showResult && (
                            <>
                                <Placemark geometry={coordOfCurrentPlace} options={{ preset: "islands#redDotIcon" }} />
                                <Polyline
                                    geometry={[markerOfUser, coordOfCurrentPlace]}
                                    options={{
                                        strokeColor: "#ff1e1e",
                                        strokeWidth: 2,
                                        strokeStyle: "shortdash",
                                    }}
                                />
                            </>
                        )}
                        {isTimeOver && <Placemark geometry={coordOfCurrentPlace} options={{ preset: "islands#redDotIcon" }} />}
                    </Map>
                </YMaps>
            </div>
            {markerOfUser && !isTimeOver && (
                <button className="g_page_btn_check_result" onClick={checkResult} disabled={showResult}>
                    Check
                </button>
            )}
        </div>
    );
};
export default Ymap;
