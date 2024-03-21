import {useRef, useEffect, FC} from 'react';
import { Marker, layerGroup} from 'leaflet';
import useMap from '../../hooks/use-map';
import {TCity, TOffer} from '../../const';
import 'leaflet/dist/leaflet.css';
import { TMapPositionType, currentCustomIcon, defaultCustomIcon } from './const';

export type TMapProps = {
  city: TCity;
  points: TOffer[];
  selectedPoint?: TOffer | null;
  mapPositionType: TMapPositionType;
};

export const Map: FC<TMapProps> = ({city, points, selectedPoint, mapPositionType: mapType}) => {
  const mapRef = useRef(null);
  const map = useMap(mapRef, city);

  useEffect(() => {
    let mounted = true;
    if (mounted){
      map?.panTo({lat: city.location.latitude, lng: city.location.longitude});
      map?.setZoom(city.location.zoom);
    }
    return () => {
      mounted = false;
    };
  }, [city, map]);

  useEffect(() => {
    let mounted = true;
    if (map && mounted) {
      const markerLayer = layerGroup().addTo(map);
      points.forEach((point) => {
        const marker = new Marker({
          lat: point.location.latitude,
          lng: point.location.longitude
        });

        const isSelected = selectedPoint !== undefined
          && point.location.latitude === selectedPoint?.location.latitude
          && point.location.longitude === selectedPoint.location.longitude;

        marker.setIcon(isSelected ? currentCustomIcon : defaultCustomIcon).addTo(markerLayer);
      });

      return () => {
        map.removeLayer(markerLayer);
        mounted = false;
      };
    }

  }, [map, points, selectedPoint]);

  return (
    <section
      className={`${mapType}__map map`}
      data-testid='map'
    >
      <div style={{height: '100%'}} ref={mapRef}></div>
    </section>
  );
};
