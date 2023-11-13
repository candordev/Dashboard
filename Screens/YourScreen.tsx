import React from "react";
import { ScrollView, View } from "react-native";
import Card from "../Components/Card";
import colors from "../Styles/colors";

const YourScreen = ({ navigation }: any) => {
    const issues = [
        {
            date: "Aug 31",
            title: "There aren't enough printers in the library",
            description:
                "There are only 2 printers in the library. This is not enough for the number of students that use the library. We need more printers becasue the lines are too long and students are not able to print their assignments on time.",
            status: "Accepted",
            category: "Education",
        },
        {
            date: "Aug 31",
            title: "The library is too cold",
            description:
                "The library is too cold. The temperature should be increased by 2 degrees. Other students have also complained about the temperature.",
            status: "Accepted",
            category: "Education",
        },
        {
            date: "Aug 31",
            title: "There isn't enough parking next to the football stadium",
            description:
                "During game days, there isn't enough parking next to the football stadium. We need more parking spots because students are not able to find parking and are late to the games.",
            status: "Accepted",
            category: "Parking",
        },
    ];

    return (
        //center scroll view
        <ScrollView
            style={{ flex: 1, backgroundColor: colors.background }}
            contentContainerStyle={{
                alignItems: "center",
            }}
        >
            <View
                style={{
                    width: "70%",
                    marginBottom: 30,
                }}
            >
                {issues.map((issue, index) => (
                    <Card key={index} issue={issue} />
                ))}
            </View>
        </ScrollView>
    );
};

export default YourScreen;
