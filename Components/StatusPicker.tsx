import { Text, View } from "react-native";
import colors from "../Styles/colors";

const StatusPicker = () => {
  return (
    <View
      style={{
        backgroundColor: colors.lightestgray,
        borderRadius: 15,
        flexDirection: "row",
        columnGap: 7,
        height: 37,
        marginLeft: 10,
      }}
    >
      <View
        style={{
          backgroundColor: colors.black,
          borderRadius: 15,
          paddingHorizontal: 10,
          justifyContent: "center",
        }}
      >
        <Text style={{ color: colors.white, fontWeight: '500' }}>New</Text>
      </View>
      <View
        style={{
          backgroundColor: colors.black,
          borderRadius: 15,
          paddingHorizontal: 10,
          justifyContent: "center",
        }}
      >
        <Text style={{ color: colors.white, fontWeight: '500' }}>Assigned</Text>
      </View>
      <View
        style={{
          backgroundColor: colors.lightestgray,
          borderRadius: 15,
          paddingHorizontal: 10,
          justifyContent: "center",
        }}
      >
        <Text style={{ color: colors.black, fontWeight: '500' }}>Updated</Text>
      </View>
      <View
        style={{
          backgroundColor: colors.lightestgray,
          borderRadius: 15,
          paddingHorizontal: 10,
          justifyContent: "center",
        }}
      >
        <Text style={{ color: colors.black, fontWeight: '500' }}>Completed</Text>
      </View>
    </View>
  );
};

export default StatusPicker;
