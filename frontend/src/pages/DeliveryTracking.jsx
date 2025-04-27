import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaUtensils, FaMotorcycle } from "react-icons/fa";
import { GrRestaurant } from "react-icons/gr";
import { RiMotorbikeFill } from "react-icons/ri";
import { renderToStaticMarkup } from "react-dom/server";

// Remove default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "",
  iconUrl: "",
  shadowUrl: "",
});

// Function to create a custom icon from React Icon
const createCustomIcon = (iconComponent, color = "black") => {
  const iconMarkup = renderToStaticMarkup(
    <div style={{ fontSize: "30px", color }}>{iconComponent}</div>
  );
  return new L.DivIcon({
    html: iconMarkup,
    className: "",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

// Create Custom Icons
const restaurantIcon = createCustomIcon(<GrRestaurant />);
const driverIcon = createCustomIcon(<RiMotorbikeFill />);

const containerStyle = {
  width: "100%",
  height: "500px",
};

const centerDefault = { lat: 6.9271, lng: 79.8612 };

const RecenterMap = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) map.setView([coords.lat, coords.lng], 13);
  }, [coords, map]);
  return null;
};

const sanitizeAddress = (address) => {
  if (!address) return "";
  return address.replace(/(,\s*Sri Lanka)+/gi, ", Sri Lanka").trim();
};

const DeliveryTracking = () => {
  const [locations, setLocations] = useState(null);
  const [coords, setCoords] = useState({
    customer: null,
    restaurant: null,
    driver: null,
  });
  const [routeCoords, setRouteCoords] = useState([]);
  const [movingDriverPos, setMovingDriverPos] = useState(null);

  const OPENROUTESERVICE_API_KEY =
    "5b3ce3597851110001cf624869e19a90b2f84160bbbe1d93d78d6d8a";

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8008/api/deliveryTracking",
          {
            params: {
              restaurantId: "680a7437be0abbf88554c454",
              userId: "68088e42895485ff1f69eca4",
            },
          }
        );
        setLocations(res.data);
        console.log("Locations:", res.data);
      } catch (err) {
        console.error("Error fetching locations:", err);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    const geocode = async (address) => {
      if (!address) return null;
      try {
        const cleanAddress = sanitizeAddress(address);
        const res = await axios.get(
          "https://nominatim.openstreetmap.org/search",
          {
            params: { q: cleanAddress, format: "json", limit: 1 },
          }
        );
        if (res.data.length > 0) {
          const { lat, lon } = res.data[0];
          return { lat: parseFloat(lat), lng: parseFloat(lon) };
        }
      } catch (err) {
        console.error("Geocode error:", err);
      }
      return null;
    };

    const convert = async () => {
      if (locations) {
        const [customer, restaurant] = await Promise.all([
          geocode(locations.customerLocation),
          geocode(locations.restaurantLocation),
        ]);
        setCoords((prev) => ({ ...prev, customer, restaurant }));
      }
    };
    convert();
  }, [locations]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const driver = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setCoords((prev) => ({ ...prev, driver }));
        },
        (err) => console.error("Geolocation error:", err)
      );
    }
  }, []);

  useEffect(() => {
    const fetchRoutes = async () => {
      const { driver, restaurant, customer } = coords;
      if (!driver || !restaurant || !customer) return;

      try {
        // Fetch route: Driver -> Restaurant
        const toRestaurantRes = await axios.get(
          "https://api.openrouteservice.org/v2/directions/driving-car",
          {
            params: {
              start: `${driver.lng},${driver.lat}`,
              end: `${restaurant.lng},${restaurant.lat}`,
            },
            headers: { Authorization: OPENROUTESERVICE_API_KEY },
          }
        );

        // Fetch route: Restaurant -> Customer
        const toCustomerRes = await axios.get(
          "https://api.openrouteservice.org/v2/directions/driving-car",
          {
            params: {
              start: `${restaurant.lng},${restaurant.lat}`,
              end: `${customer.lng},${customer.lat}`,
            },
            headers: { Authorization: OPENROUTESERVICE_API_KEY },
          }
        );

        console.log("toCustomerRes", toCustomerRes);
        // Decode the routes
        const routeToRestaurant =
          toRestaurantRes.data.features[0].geometry.coordinates.map(
            ([lng, lat]) => [lat, lng]
          );
        const routeToCustomer =
          toCustomerRes.data.features[0].geometry.coordinates.map(
            ([lng, lat]) => [lat, lng]
          );

        // Combine routes
        setRouteCoords([...routeToRestaurant, ...routeToCustomer]);
      } catch (err) {
        console.error("Route fetch error:", err);
      }
    };

    fetchRoutes();
  }, [coords.driver, coords.restaurant, coords.customer]);

  useEffect(() => {
    if (routeCoords.length === 0) return;

    let index = 0;
    const duration = 10000; // 10 seconds for full trip
    const interval = duration / routeCoords.length;

    const intervalId = setInterval(() => {
      if (index >= routeCoords.length) {
        clearInterval(intervalId);
        return;
      }

      setMovingDriverPos(routeCoords[index]);

      // Update Polyline to only show remaining route
      setRouteCoords((prevRoute) => prevRoute.slice(index));

      index++;
    }, interval);

    return () => clearInterval(intervalId);
  }, [routeCoords]);

  return (
    <div>
      <h2 style={{ marginBottom: "10px" }}>Delivery Tracking</h2>
      <MapContainer
        style={containerStyle}
        center={centerDefault}
        zoom={13}
        scrollWheelZoom={false}
      >
        {coords?.restaurant && <RecenterMap coords={coords.restaurant} />}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Markers */}
        {/* Markers */}
        {coords?.restaurant && (
          <Marker position={coords.restaurant} icon={restaurantIcon}>
            <Popup>Restaurant</Popup>
          </Marker>
        )}
        {movingDriverPos && (
          <Marker position={movingDriverPos} icon={driverIcon}>
            <Popup>Driver is moving</Popup>
          </Marker>
        )}
        {coords?.customer && (
          <Marker
            position={coords.customer}
            icon={createCustomIcon(<FaUtensils />, "green")}
          >
            <Popup>Customer</Popup>
          </Marker>
        )}

        {/* Route Polyline */}
        {routeCoords.length > 0 && (
          <Polyline positions={routeCoords} color="blue" />
        )}
      </MapContainer>
    </div>
  );
};

export default DeliveryTracking;
