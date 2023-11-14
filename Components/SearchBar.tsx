import React, { useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  Platform,
} from "react-native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import colors from "../Styles/colors";
import Text from "./Native/Text";

type SearchBarProps = {
  searchPhrase: string;
  setSearchPhrase: (searchPhrase: string) => void;
  placeholder: string;
};

function SearchBar({
  searchPhrase,
  setSearchPhrase,
  placeholder,
}: SearchBarProps): JSX.Element {
  const searchWidth = useRef(new Animated.Value(100)).current;
  const [clicked, setClicked] = useState(false);

  const animateSearchWidth = (endVal: number) => {
    Animated.timing(searchWidth, {
      toValue: endVal,
      duration: 150,
      useNativeDriver: false,
    }).start(() => {
      if (endVal == 85) {
        setClicked(true);
      } else {
        setClicked(false);
      }
    });
  };

  return (
    <View
      style={{
        justifyContent: "flex-end",
        height: "100%",
        alignItems: "flex-start",
      }}
    >
      <View style={styles.container}>
        <View style={[styles.searchBar]}>
          <AntDesignIcon name="search1" size={20} color={colors.gray} />
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={colors.black}
            value={searchPhrase}
            onChangeText={setSearchPhrase}
          />
          {clicked && (
            <Pressable
              onPress={() => {
                setSearchPhrase("");
              }}
            >
              <AntDesignIcon name="close" size={20} color={colors.gray} />
            </Pressable>
          )}
        </View>
        {clicked && (
          <Pressable
            style={{ paddingLeft: 10, paddingVertical: 5 }}
            onPress={() => {
              Keyboard.dismiss();
            }}
          >
            <Text style={{ color: colors.gray, fontSize: 14 }}>Cancel</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
export default SearchBar;

// styles
const styles = StyleSheet.create({
  container: {
    marginHorizontal: "5%",
    alignItems: "center",
    flexDirection: "row",
    width: "90%",
    backgroundColor: colors.white,
  },
  searchBar: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightgray,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  input: {
    fontSize: 15,
    fontFamily: "OpenSans",
    marginLeft: 10,
    flex: 1,
    color: colors.black,
    paddingVertical: 0,
    outlineStyle: "none",
  },
});
