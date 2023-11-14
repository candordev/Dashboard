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
  return (
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
      </View>
    </View>
  );
}
export default SearchBar;

// styles
const styles = StyleSheet.create({
  container: {
    height: 36,
    alignItems: "center",
    width: "100%",
    backgroundColor: colors.white,
  },
  searchBar: {
    flex: 1,
    paddingHorizontal: 10,
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
