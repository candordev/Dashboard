import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import colors from "../Styles/colors";
import Popover, { PopoverPlacement } from "react-native-popover-view";
import Text from "./Text";
import NotifSection from "./NotifSection";
import NotifPopover from "./NotifPopover";

// Define a type for the props
interface NotifDropdownProps {}

const NotifDropdown = (props: NotifDropdownProps) => {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const handleClickNotif = (option: string) => {
        // Handle notification click here
    };

    return (
        <View style={styles.container}>
            <Popover
                isVisible={isDropdownVisible}
                onRequestClose={() => setIsDropdownVisible(false)}
                placement={PopoverPlacement.BOTTOM}
                from={
                    <TouchableOpacity
                        style={{
                            backgroundColor: colors.lightergray,
                            borderRadius: 15,
                            paddingHorizontal: 10,
                            paddingVertical: 7,
                            justifyContent: "center",
                        }}
                        onPress={() => setIsDropdownVisible(!isDropdownVisible)}
                    >
                        {/* Replace with your inbox icon */}
                        <Text style={styles.text}>Inbox</Text>
                    </TouchableOpacity>
                }
            >
                {/* Replace with your notification items */}
                <View style={{backgroundColor: colors.red, padding: 10}}>
                    <NotifPopover  navigation={undefined} selectedNotificationFromPopup={undefined} />
                </View>
            </Popover>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
    },
    button: {
        borderRadius: 15,
        paddingHorizontal: 10,
        justifyContent: "center",
    },
    text: {
        fontWeight: "500",
        fontSize: 15,
        fontFamily: "Montserrat",
    },
});

export default NotifDropdown;
