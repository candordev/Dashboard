import React from "react";
import { View } from "react-native";

import colors from "../Styles/colors";

import Text from "./Text";
import { Update } from "../utils/interfaces";

interface UpdateCardProps {
    update: Update;
  }

function UpdateCard(props: UpdateCardProps): JSX.Element {
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