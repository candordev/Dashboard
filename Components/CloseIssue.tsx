import React from "react";
import { Pressable, TouchableOpacity, View } from "react-native";
import colors from "../Styles/colors";
import Text from "./Text";

const CloseIssue = () => {
    return (
        <TouchableOpacity style={{backgroundColor: colors.red, borderRadius: 10, paddingVertical: 10, alignItems: 'center'}}>
            <Text style={{fontFamily: "Montserrat", color: colors.white, fontSize: 18, fontWeight: '600'}}>Close Issue</Text>
        </TouchableOpacity>
    )
}

export default CloseIssue;