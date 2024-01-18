import React, { useEffect, useState } from "react";
import { Post } from "../utils/interfaces";
import Text from "./Text";
import { View } from "react-native";
import colors from "../Styles/colors";
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text } : any) => <div>{text}</div>;

type MapMarkerViewProps = {
  posts: Post[];
};

type Coord = {
  latitude: number;
  longitude: number;
};

type MarkerData = {
  latitude: number;
  longitude: number;
  title: string;
};

const MapMarkerView = ({ posts }: MapMarkerViewProps) => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  useEffect(() => {
    const loadMarkers = async () => {
      const filteredPosts: Post[] = posts.filter((post) => post.location);
      const markerData: MarkerData[] = await Promise.all(
        filteredPosts.map(async (post) => {
          const coordinates = await getCoordinatesFromAddress(post);
          return { ...coordinates, title: post.title };
        })
      );
      setMarkers(markerData);
    };

    loadMarkers();
  }, [posts]);

  const getCoordinatesFromAddress = async (post: Post) => {
    const lat: number = +post.lat;
    const lng: number = +post.lng;
    const coord: Coord = { latitude: lat, longitude: lng };
    return coord;
  };

  return (
    <View style={{ flex: 1 }}>
      {/* {markers.map((marker, index) => (
        <Marker
          key={index}
          coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
          title={marker.title}
        />
      ))} */}
    </View>
  );
};

export default MapMarkerView;
