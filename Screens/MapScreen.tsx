import React from "react";
import { View } from "react-native";
import Text from "../Components/Text";
import colors from "../Styles/colors";
import OuterView from "../Components/OuterView";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import GoogleMapReact from "google-map-react";

const AnyReactComponent = ({ text }: any) => <div>{text}</div>;

const defaultProps = {
  center: {
    lat: 10.99835602,
    lng: 77.01502627,
  },
  zoom: 11,
};

const Marker = (props: any) => {
  return (
    <View style={{ height: 50, width: 50, backgroundColor: colors.red }} />
  );
};

const MapScreen = () => {
  //   const { isLoaded } = useJsApiLoader({
  //     id: "google-map-script",
  //     googleMapsApiKey: "AIzaSyD-DMOdct5BYGr0zv9UHIZ3Sk9ZWWdJEUY",
  //   });

  //   const [map, setMap] = React.useState(null);

  //   const onLoad = React.useCallback(function callback(map: any) {
  //     // This is just an example of getting and using the map instance!!! don't just blindly copy!
  //     const bounds = new window.google.maps.LatLngBounds(center);
  //     map.fitBounds(bounds);

  //     setMap(map);
  //   }, []);

  //   const onUnmount = React.useCallback(function callback(map: any) {
  //     setMap(null);
  //   }, []);

  return (
    <OuterView style={{padding: 0, overflow: "hidden"}}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyD-DMOdct5BYGr0zv9UHIZ3Sk9ZWWdJEUY" }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
          style={{borderRadius: 10}}
        >
          <Marker lat={10.99835602} lng={77.01502627} text="My Marker" />
        </GoogleMapReact>
      {/* {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          onLoad={onLoad}
          onUnmount={onUnmount}
        ></GoogleMap>
      ) : (
        <></>
      )} */}
    </OuterView>
    // <View style={{flex: 1, backgroundColor: colors.background}}>
    //   <Text>Map Screen</Text>
    // </View>
  );
};

export default MapScreen;
