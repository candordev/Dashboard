import React, { useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  Platform,
  TouchableOpacity,
} from "react-native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import colors from "../Styles/colors";
import Text from "./Text";
import { Endpoints } from "../utils/Endpoints";

type SearchBarProps = {
  searchPhrase: string;
  setSearchPhrase: (searchPhrase: string) => void;
  placeholder: string;
  containerStyle?: any;
  searchBarStyle?: any;
};

function SearchBar({
  searchPhrase,
  setSearchPhrase,
  placeholder,
  containerStyle,
  searchBarStyle,
}: SearchBarProps): JSX.Element {
  const clearInput = () => {
    setSearchPhrase("");
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.searchBar, searchBarStyle]}>
        <AntDesignIcon name="search1" size={20} color={colors.gray} />
        <View style={{ flex: 1 }}>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={colors.gray}
            value={searchPhrase}
            onChangeText={setSearchPhrase}
          />
        </View>
        {searchPhrase.length > 0 && (
          <TouchableOpacity onPress={clearInput} style={styles.clearButton}>
            <AntDesignIcon name="close" size={20} color={colors.gray} />{" "}
            {/* Changed icon name to "close" */}
          </TouchableOpacity>
        )}
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
    backgroundColor: colors.background,
  },
  searchBar: {
    flex: 1,
    paddingHorizontal: 10,
    flexDirection: "row",
    backgroundColor: colors.white,
    // borderWidth: 2,
    // borderColor: colors.lightergray,
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
  },
  input: {
    fontSize: 15,
    fontFamily: "Montserrat",
    marginLeft: 10,
    fontWeight: "500" as any,
    flex: 1,
    color: colors.black,
    paddingVertical: 0,
    outlineStyle: "none",
  },
  // clearButton: {
  //   marginLeft: 10,
  // },
});
