import React from "react";
import { ScrollView, View } from "react-native";
import Card from "../Components/Card";
import colors from "../Styles/colors";

const AllScreen = ({ navigation }: any) => {
  const issues = [
    {
      date: "Aug 31",
      title: "Keep at least one library open",
      description:
        "All libraries have been closed during breaks. however, at least one of the libraries should be available to students in case they need to do research in the library",
      status: "Accepted",
      category: "Education",
    },
    {
      date: "Aug 31",
      title: "Keep at least one library open",
      description:
        "All libraries have been closed during breaks. however, at least one of the libraries should be available to students in case they need to do research in the library",
      status: "Accepted",
      category: "Education",
    },
    {
      date: "Aug 31",
      title: "Keep at least one library open",
      description:
        "All libraries have been closed during breaks. however, at least one of the libraries should be available to students in case they need to do research in the library",
      status: "Accepted",
      category: "Education",
    },
    {
      date: "Aug 31",
      title: "Keep at least one library open",
      description:
        "All libraries have been closed during breaks. however, at least one of the libraries should be available to students in case they need to do research in the library",
      status: "Accepted",
      category: "Education",
    },
    {
      date: "Aug 31",
      title: "Keep at least one library open",
      description:
        "All libraries have been closed during breaks. however, at least one of the libraries should be available to students in case they need to do research in the library",
      status: "Accepted",
      category: "Education",
    },
    {
      date: "Aug 31",
      title: "Keep at least one library open",
      description:
        "All libraries have been closed during breaks. however, at least one of the libraries should be available to students in case they need to do research in the library",
      status: "Accepted",
      category: "Education",
    },
    {
      date: "Aug 31",
      title: "Keep at least one library open",
      description:
        "All libraries have been closed during breaks. however, at least one of the libraries should be available to students in case they need to do research in the library",
      status: "Accepted",
      category: "Education",
    },
    {
      date: "Aug 31",
      title: "Keep at least one library open",
      description:
        "All libraries have been closed during breaks. however, at least one of the libraries should be available to students in case they need to do research in the library",
      status: "Accepted",
      category: "Education",
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

export default AllScreen;
