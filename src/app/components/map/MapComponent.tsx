'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { GoogleMap, InfoWindow, Libraries, Marker, useLoadScript } from '@react-google-maps/api';
import { GOOGLE_API_KEY } from '@/app/constants/constants';
import { Property } from "@/app/model/model";
import { useFlats } from "@/context/FlatContext";
import {useTranslation} from "react-i18next";

const MapComponent = () => {
    const libraries = useMemo(() => ['places'] as Libraries, []);
    const { allFlats } = useFlats();
    const {t} = useTranslation();
    const [mapCenter, setMapCenter] = useState({ lat: 48.208910, lng: 16.373330 });
    const [zoom, setZoom] = useState(13);
    const [activeProperty, setActiveProperty] = useState<Property | null>(null);
    const [hoveredPin, setHoveredPin] = useState<Property | null>(null);
    const mapOptions = useMemo<google.maps.MapOptions>(
        () => ({
            disableDefaultUI: true,
            clickableIcons: true,
            scrollwheel: true,
            zoomControl: true,
            gestureHandling: 'greedy',
        }),
        []
    );

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: GOOGLE_API_KEY,
        libraries,
    });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setMapCenter({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Error getting user location:", error);
                }
            );
        }
    }, []);

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    const handleMouseOver = (property: Property) => {
        setHoveredPin(property);
    };

    const handleMouseOut = () => {
        setHoveredPin(null);
    };

    const handleClick = (property: Property) => {
        setActiveProperty(property);
        setMapCenter({ lng: +property.position.lng, lat: +property.position.lat });
        setZoom(19);
    };

    const onDetailsClose = () => {
        setActiveProperty(null);
        setZoom(13);
    };

    const customIcon = {
        path: "M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7zM12 11.5c-1.378 0-2.5-1.122-2.5-2.5S10.622 6.5 12 6.5s2.5 1.122 2.5 2.5S13.378 11.5 12 11.5z",
        fillColor: "#0000FF",
        fillOpacity: 0.8,
        strokeWeight: 0,
        scale: 1.5,
    };

    return (
        <GoogleMap
            options={mapOptions}
            zoom={zoom}
            center={mapCenter}
            mapTypeId={google.maps.MapTypeId.ROADMAP}
            mapContainerStyle={{ width: '100%', height: '100%' }}
            onLoad={() => console.log('Map Component Loaded...')}
        >
            {allFlats.map((property, index) => (
                <Marker
                    key={index}
                    position={{ lat: +property.position.lat, lng: +property.position.lng }}
                    icon={customIcon}
                    onMouseOver={() => handleMouseOver(property)}
                    onMouseOut={handleMouseOut}
                    onClick={() => handleClick(property)}
                />
            ))}

            {hoveredPin && (
                <InfoWindow
                    position={{ lat: +hoveredPin.position.lat, lng: +hoveredPin.position.lng }}
                    onCloseClick={() => setHoveredPin(null)}
                >
                    <div>
                        <h4>{t("map.details")}</h4>
                        <p>{hoveredPin.short_description}</p>
                    </div>
                </InfoWindow>
            )}

            {activeProperty && (
                <InfoWindow
                    position={{ lat: +activeProperty.position.lat, lng: +activeProperty.position.lng }}
                    onCloseClick={() => onDetailsClose()}
                >
                    <div>
                        <h4>{activeProperty.title}</h4>
                        <p>{activeProperty.description}</p>
                        <p>Price: {activeProperty.price}</p>
                        <p>Contact: {activeProperty.email}</p>
                        <div className="flex">
                            {activeProperty?.pictures?.map((picture, index) => (
                                <img
                                    key={index}
                                    src={`http://localhost:5000${picture.url}`}
                                    alt={picture.description}
                                    style={{ width: '250px', height: '200px', margin: '5px' }}
                                />
                            ))}
                        </div>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    );
};

export default MapComponent;
