import React from "react";
import { View, TouchableOpacity } from "react-native";
import Text from "./Text";
import { Link } from "@react-navigation/native";
import colors from "../Styles/colors";
import FeatherIcon from "react-native-vector-icons/Feather";

const LHN = ({ props }: any) => {
  const handleNavigation = (screenName: string) => {
    // Handle navigation logic here
    console.log(`Navigating to ${screenName}`);
  };

  return (
    <View style={styles.container}>
      <NavItem name={"All Issues"} route="/all" icon="list" />
      <NavItem name={"Your Issues"} route="/your" icon="list" />
      <NavItem name={"Suggested Issues"} route="/suggested" icon="list" />
    </View>
  );
};

type NavItemProps = {
  route: string;
  icon: string;
  name: string;
};

const NavItem = ({ route, icon, name }: NavItemProps) => {
  return (
    <Link to={route}>
      <View
        style={{
          marginBottom: 10,
          paddingVertical: 10,
          paddingHorizontal: 20,
          flexDirection: "row" as any,
          alignItems: "center" as any,
          columnGap: 10,
        }}
      >
        <FeatherIcon name={icon} size={20} color={colors.white} />
        <Text style={styles.navItemText}>{name}</Text>
      </View>
    </Link>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.black,
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  navItemText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.white,
  },
};

export default LHN;
