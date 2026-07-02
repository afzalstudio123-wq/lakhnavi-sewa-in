'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Clock, ShieldAlert } from 'lucide-react';
import { THEME } from '../../utils/theme';

declare const L: any; // Leaflet global declaration

export const MapTracking: React.FC = () => {
  const mapRef = useRef<any>(null);
  const providerMarkerRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  
  // Simulated tracking properties
  const [eta, setEta] = useState(12); // minutes
  const [distance, setDistance] = useState(3.4); // km
  const [stepIndex, setStepIndex] = useState(0);

  // Lucknow routes coordinates: Hazratganj to Gomti Nagar
  const routePoints = [
    [26.8467, 80.9462], // Hazratganj Hub
    [26.8480, 80.9580],
    [26.8510, 80.9700],
    [26.8530, 80.9820],
    [26.8500, 81.0000], // Gomti Nagar Grid
  ];

  // Dynamic script injection for Leaflet (Free & No package.json change)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if Leaflet CSS already loaded
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Check if Leaflet JS already loaded
    if (window.hasOwnProperty('L')) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      // Clean up map instance on unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!scriptLoaded || mapRef.current || typeof window === 'undefined') return;

    try {
      const initialPos = routePoints[0];
      
      // Initialize map instance
      const mapInstance = L.map('leaflet-map-container', {
        center: [26.8480, 80.9730],
        zoom: 13,
        zoomControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance);

      // Custom icon vectors
      const providerIcon = L.divIcon({
        className: 'bg-primary border-2 border-white rounded-full flex items-center justify-center text-white font-bold p-1 shadow-lg',
        html: '<div class="w-4 h-4 rounded-full bg-primary animate-pulse" />',
        iconSize: [24, 24]
      });

      const customerIcon = L.divIcon({
        className: 'bg-accent border-2 border-white rounded-full flex items-center justify-center text-white font-bold p-1 shadow-lg',
        html: '<div class="w-4 h-4 rounded-full bg-accent" />',
        iconSize: [24, 24]
      });

      // Markers
      const provMarker = L.marker(initialPos, { icon: providerIcon }).addTo(mapInstance);
      L.marker(routePoints[routePoints.length - 1], { icon: customerIcon }).addTo(mapInstance);

      // Route Polyline
      L.polyline(routePoints, { color: '#5C33F6', weight: 4, opacity: 0.8 }).addTo(mapInstance);

      providerMarkerRef.current = provMarker;
      mapRef.current = mapInstance;
      setMapLoaded(true);
    } catch (e) {
      console.error('Leaflet initialization failed', e);
    }
  }, [scriptLoaded]);

  // Simulation movement loop
  useEffect(() => {
    if (!mapLoaded || !providerMarkerRef.current) return;

    const interval = setInterval(() => {
      setStepIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % routePoints.length;
        const newCoords = routePoints[nextIndex];
        
        // Update Leaflet marker position
        providerMarkerRef.current.setLatLng(newCoords);
        
        // Update stats
        setDistance(Math.max(0.5, 3.4 - (nextIndex * 0.7)));
        setEta(Math.max(2, 12 - (nextIndex * 2)));
        
        return nextIndex;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [mapLoaded]);

  return (
    <div className={THEME.card}>
      <div className="flex justify-between items-center border-b border-borderColor/60 pb-3 mb-4">
        <div>
          <h3 className="font-extrabold text-sm text-ink uppercase tracking-wider flex items-center gap-1.5">
            <Navigation className="text-primary animate-spin" size={16} />
            Live Provider ETA Tracker
          </h3>
          <p className="text-[10px] text-muted font-bold mt-0.5">Hazard Safe GPS telemetry linked to Gomti Nagar node</p>
        </div>
        <span className="text-[9px] font-black uppercase text-semantic-success bg-semantic-success/10 px-2 py-0.5 rounded border border-semantic-success/20 animate-pulse">
          Live Sync
        </span>
      </div>

      {/* Map container */}
      <div className="relative">
        <div 
          id="leaflet-map-container" 
          className="h-64 w-full bg-surface border border-borderColor rounded-2xl overflow-hidden shadow-inner relative z-10"
        />
        
        {/* Fallback skeleton if script is not fully loaded */}
        {!mapLoaded && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#F8F9FC] border border-borderColor rounded-2xl">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs font-bold text-muted uppercase tracking-wider">Syncing Lucknow GPS Coordinates...</p>
          </div>
        )}
      </div>

      {/* Analytics specs card */}
      <div className="grid grid-cols-3 gap-4 mt-4 border-t border-borderColor/60 pt-4 text-center">
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] font-bold text-muted uppercase">ETA Duration</span>
          <span className="text-base font-black text-primary font-mono">{eta} Mins</span>
        </div>
        <div className="flex flex-col gap-0.5 border-x border-borderColor">
          <span className="text-[9px] font-bold text-muted uppercase">Distance</span>
          <span className="text-base font-black text-ink font-mono">{distance.toFixed(1)} KM</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] font-bold text-muted uppercase">Simulated Node</span>
          <span className="text-xs font-black text-ink uppercase truncate">
            {stepIndex === 0 ? 'Hazratganj' : stepIndex === 4 ? 'Gomti Nagar' : 'Mahanagar Link'}
          </span>
        </div>
      </div>
    </div>
  );
};
export default MapTracking;
