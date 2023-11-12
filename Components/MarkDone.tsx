import React from "react";
import { Pressable, View } from "react-native";
import colors from "../Styles/colors";
import Text from "./Text";

const MarkDone = () => {
    return (
        <Pressable style={{backgroundColor: colors.black, borderRadius: 10, paddingVertical: 10, alignItems: 'center'}}>
            <Text style={{fontFamily: "Montserrat", color: colors.white, fontSize: 18, fontWeight: '600'}}>Mark Completed</Text>
        </Pressable>
    )
}

export default MarkDone;