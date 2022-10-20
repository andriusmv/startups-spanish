
import * as React from 'react';
import {useState, useMemo} from 'react';
import {render} from 'react-dom';
import { mapboxClient } from '../utils/mapbox';
import Map, {
    Marker,
    Popup,
    NavigationControl,
    FullscreenControl,
    ScaleControl,
    GeolocateControl
} from 'react-map-gl';
import ControlPanel from './control-panel';
import Pin from './pin';
import STARTUPS from '../.data/startups.json';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const TOKEN = ''; // Set your mapbox token here

mapboxgl.accessToken = mapboxClient;

export default function Startupsmap() {
    const [popupInfo, setPopupInfo] = useState(null);
    
    const pins = useMemo(
    () =>
      STARTUPS.map((startup, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={startup.longitude}
          latitude={startup.latitude}
          anchor="bottom"
          onClick={e => {
            // If we let the click event propagates to the map, it will immediately close the popup
            // with `closeOnClick: true`
            e.originalEvent.stopPropagation();
            setPopupInfo(startup);
          }}
        >
          <Pin />
        </Marker>
      )),
    []
  );

  return (
    <>
      <Map
        initialViewState={{
          latitude: 25,
          longitude: -35,
          zoom: 1.5,
          bearing: 0,
          pitch: 0
        }}
        style={{width: 800, height: 600}}
        mapStyle="mapbox://styles/mapbox/dark-v8"
        mapboxAccessToken={TOKEN}
      >
        <GeolocateControl position="top-left" />
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl />

        {pins}

        {popupInfo && (
          <Popup
            anchor="top"
            longitude={Number(popupInfo.longitude)}
            latitude={Number(popupInfo.latitude)}
            onClose={() => setPopupInfo(null)}
          >
            <div>
              {popupInfo.startup}, {popupInfo.state} |{' '}
              <a
                target="_new"
                href={`http://en.wikipedia.org/w/index.php?title=Special:Search&search=${popupInfo.startup}, ${popupInfo.state}`}
              >
                Wikipedia
              </a>
            </div>
            <img width="100%" src={popupInfo.image} />
          </Popup>
        )}
      </Map>

      <ControlPanel />
    </>
  );
}

export function renderToDom(container) {
  render(<Startupsmap />, container);
}