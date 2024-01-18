import React from "react";
import { View } from "react-native";
import Text from "../Components/Text";
import colors from "../Styles/colors";
import OuterView from "../Components/OuterView";
import { Marker } from "react-native-maps";

import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "400px",
  height: "400px",
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

type MarkerData = {
  latitude: number;
  longitude: number;
};

const point: MarkerData = {
  latitude: -3.745,
  longitude: -38.523,
};

const MapScreen = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyD-DMOdct5BYGr0zv9UHIZ3Sk9ZWWdJEUY",
  });

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map: any) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map: any) {
    setMap(null);
  }, []);

  return (
    <OuterView>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {/* Child components, such as markers, info windows, etc. */}
          {/* <Marker key={0} coordinate={point} title={"something"} /> */}
          <></>
        </GoogleMap>
      ) : (
        <></>
      )}
    </OuterView>
    // <View style={{flex: 1, backgroundColor: colors.background}}>
    //   <Text>Map Screen</Text>
    // </View>
  );
};

export default MapScreen;
