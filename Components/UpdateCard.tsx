import React from "react";
import { View } from "react-native";

import colors from "../Styles/colors";

import Text from "./Text";
import { Update } from "../utils/interfaces";

interface UpdateCardProps {
    update: Update;
  }

function UpdateCard(props: UpdateCardProps): JSX.Element {

    const formatDate = (createdAt: string): string => {
        const now = new Date();
        const createdDate = new Date(createdAt); // Parse the string into a Date object
        const diffMs = now.getTime() - createdDate.getTime(); // difference in milliseconds
        const diffMins = Math.round(diffMs / 60000); // minutes
        const diffHrs = Math.round(diffMins / 60); // hours
        const diffDays = Math.round(diffHrs / 24); // days
      
        if (diffMins < 60) {
          return `${diffMins} minutes ago`;
        } else if (diffHrs < 24) {
          return `${diffHrs} hours ago`;
        } else if (diffDays < 7) {
          return `${diffDays} days ago`;
        } else {
          // Format the date to show in "MM/DD/YYYY" format
          return createdDate.toLocaleDateString();
        }
      };
      

    return (
        
        <View
            style={{
                borderColor: colors.lightestgray,
                backgroundColor: colors.white,
                borderWidth: 2,
                borderRadius: 10,
                padding: 10,
            }}
        >
            <View style={{flexDirection: "row", marginBottom: 5}}>
            <Text
                        style={{
                        fontSize: 15,
                        fontWeight: "600",
                        fontFamily: "Montserrat",
                        }}
                    >
                         {props.update.userProfile.firstName + ' ' + props.update.userProfile.lastName}
                       
                    </Text>
            <Text
                style={{
                    fontSize: 13,
                    fontWeight: "500",
                    fontFamily: "Montserrat",
                    color: "gray",
                    marginLeft: 10,
                    marginTop: 2
                }}
            >
                 {formatDate(props.update.createdAt)}
            </Text>
            </View>
            <Text
                style={{
                    fontSize: 15,
                    fontWeight: "550",
                    fontFamily: "Montserrat",
                }}
            >
                {props.update.title}
            </Text>
            <Text
                style={{
                    fontSize: 13.5,
                    fontWeight: "500",
                    marginTop: 3,
                }}
            >
                {props.update.content}
            </Text>
        </View>
    );
};

export default UpdateCard;