import React, { useEffect, useState } from "react";
import { Post } from "../utils/interfaces";
import Text from "./Text";
import {
    Pressable,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";
import colors from "../Styles/colors";
import GoogleMapReact from "google-map-react";
import styles from "../Styles/styles";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Popover, { PopoverPlacement } from "react-native-popover-view";
import ProgressBar from "./ProgressBar";
import IssueView from "./IssueView";
import { formatDate } from "../utils/utils";

type MapMarkerViewProps = {
    posts: {
        [key: string]: Post[];
    };
};

type Coord = {
    latitude: number;
    longitude: number;
};

type MarkerData = {
    latitude: number;
    longitude: number;
    title: string;
    post: Post;
};

const defaultProps = {
    center: {
        lat: 33.7,
        lng: -84.4,
    },
    zoom: 11,
};

interface MarkerProps {
  issue: Post;
  onPopoverCloseComplete: () => void; // Add this line
  hasInitialOpen: () => void; // Add this line
  isDisabled: boolean;
  initialOpen?: boolean;
  lng: number;
  lat: number;
  text: string;
}


const Marker = (props: MarkerProps) => {
    const { height, width } = useWindowDimensions();

    const issueContent = props.issue.content.substring(0, 100).toString();

    const [isPopoverVisible, setIsPopoverVisible] = useState(false);

    useEffect(() => {
        if (props.initialOpen) {
            setIsPopoverVisible(true);
            props.hasInitialOpen();
        }
    }, [props.initialOpen]);

    const togglePopover = () => {
        setIsPopoverVisible(!isPopoverVisible);
    };

    return (
        <Popover
            isVisible={isPopoverVisible}
            onRequestClose={togglePopover}
            onCloseComplete={() => {
                setIsPopoverVisible(false);
                props.onPopoverCloseComplete();
            }}
            from={
              <View style={styles.markerContainer}>
                <Pressable onPress={togglePopover}>
                  <FontAwesome name="map-pin" size={30} color="#FF5A5F" />
                </Pressable>
              </View>
            }
            placement={PopoverPlacement.FLOATING}
            popoverStyle={{
                borderRadius: 10,
                width: width * 0.7,
                height: height * 0.9,
            }}
        >
            <IssueView issue={props.issue} onPopoverCloseComplete={() => {}}/>
        </Popover>
    );
};

const MapMarkerView = ({ posts }: MapMarkerViewProps) => {
    const [markers, setMarkers] = useState<MarkerData[]>([]);

    useEffect(() => {
        const loadMarkers = async () => {
            const postsArray: Post[] = flattenPosts(posts);
            const filteredPosts: Post[] = postsArray.filter(
                (post) =>
                    post.lat &&
                    post.lng &&
                    post.lat.length > 0 &&
                    post.lng.length > 0
            );
            console.log("filtered posts", filteredPosts);
            const markerData: MarkerData[] = await Promise.all(
                filteredPosts.map(async (post) => {
                    const coordinates = await getCoordinatesFromAddress(post);
                    return { ...coordinates, title: post.title, post: post };
                })
            );
            setMarkers(markerData);
            console.log("marker data", markerData);
        };
        console.log("the posts are ", posts);
        if (posts) loadMarkers();
    }, [posts]);

    const getCoordinatesFromAddress = async (post: Post) => {
        const lat: number = +post.lat;
        const lng: number = +post.lng;
        const coord: Coord = { latitude: lat, longitude: lng };
        return coord;
    };

    function flattenPosts(postsByKeys: { [key: string]: Post[] }): Post[] {
        let flattenedPosts: Post[] = [];

        Object.keys(postsByKeys).forEach((key) => {
            flattenedPosts = flattenedPosts.concat(postsByKeys[key]);
        });

        return flattenedPosts;
    }

    return (
        <View style={{ flex: 1, borderRadius: 10, overflow: 'hidden' }}>
            <GoogleMapReact
                bootstrapURLKeys={{
                    key: "AIzaSyD-DMOdct5BYGr0zv9UHIZ3Sk9ZWWdJEUY",
                }}
                defaultCenter={defaultProps.center}
                defaultZoom={defaultProps.zoom}
                style={{ borderRadius: 10,  border: "none", }}
            >
                {markers.map((marker, index) => (
                    <Marker
                        key={index}
                        lat={marker.latitude}
                        lng={marker.longitude}
                        text={marker.title}
                        issue={marker.post}
                        isDisabled={false}
                        initialOpen={false}
                        hasInitialOpen={() => {}}
                        onPopoverCloseComplete={() => {}}
                    />
                ))}
            </GoogleMapReact>
        </View>
    );
};


export default MapMarkerView;
