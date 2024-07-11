/* import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet"
import "leaflet/dist/leaflet.css"

const Map = ({ location, path, mapHeight, mapWidth }) => {
  return (
    <MapContainer
      center={location}
      zoom={13}
      style={{ height: `${mapHeight}px`, width: `${mapWidth}px` }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={location} />
      <Polyline positions={path} color="blue" />
    </MapContainer>
  )
}

export default Map
 */
