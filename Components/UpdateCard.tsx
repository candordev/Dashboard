import React from "react";
import { View } from "react-native";

import colors from "../Styles/colors";

import Text from "./Text";

const UpdateCard = () => {
    return (
        <View
            style={{
                borderColor: colors.lightestgray,
                borderWidth: 2,
                borderRadius: 10,
                padding: 10,
            }}
        >
            <Text
                style={{
                    fontSize: 18,
                    fontWeight: "550",
                    fontFamily: "Montserrat",
                }}
            >
                Update Title
            </Text>
            <Text
                style={{
                    fontSize: 14,
                    fontWeight: "500",
                    marginTop: 5,
                }}
            >
                This is an update description. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod.
            </Text>
        </View>
    );
};

export default UpdateCard;