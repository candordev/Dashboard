import { Link } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import colors from "../Styles/colors";

type LinkButtonProps = {
  route: string;
  style: any;
  children: React.ReactNode;
};

const LinkButton = ({ route, style, children }: LinkButtonProps) => {
  return (
    <Link to={route} style={{ width: "100%" }}>
      <View
        style={[
          {
            marginVertical: 5,
            paddingVertical: 10,
            flexDirection: "row" as any,
            alignItems: "center" as any,
            justifyContent: "center" as any,
            columnGap: 10,
            backgroundColor: colors.white,
            width: "100%",
            height: 40,
            borderRadius: 10,
          },
          style,
        ]}
      >
        {children}
      </View>
    </Link>
  );
};

export default LinkButton;
