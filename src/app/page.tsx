'use client';

import React, { useState } from "react";
import MapComponent from "@/app/components/map/MapComponent";

import { AuthProvider } from "@/context/AuthContext";
import { FlatProvider } from "@/context/FlatContext";
import Header from "@/app/components/header/header";
import SidePanel from "@/app/components/sidepanel/SidePanel";

export default function Home() {
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

    return (
        <AuthProvider>
            <FlatProvider>
                <main className="flex min-h-screen w-full flex-col relative">
                    <Header onToggleSidePanel={() => setIsSidePanelOpen(!isSidePanelOpen)} />
                    <div className="flex flex-grow">
                        <SidePanel isOpen={isSidePanelOpen} />
                        <div className="map-container">
                            <MapComponent />
                        </div>
                    </div>
                    <style jsx>{`
                        .map-container {
                            flex: 1;
                            position: relative;
                            transition: margin-left 0.3s;
                            margin-left: ${isSidePanelOpen ? '250px' : '0'};
                        }
                        main {
                            position: relative;
                        }
                    `}</style>
                </main>
            </FlatProvider>
        </AuthProvider>
    );
}
