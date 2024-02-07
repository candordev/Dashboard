import React, { useState } from "react";
import { View, TextInput, StyleSheet, ActivityIndicator } from "react-native";
import colors from "../Styles/colors";
import { debounce } from "lodash";
import Icon from "react-native-vector-icons/FontAwesome";

interface DoubleTextInputProps {
  onFirstInputChange: (text: string) => void;
  onSecondInputChange: (text: string) => void;
  loading: boolean;
  onSubmit: () => void;
  submittable: boolean;
  title: string;
  content: string;
}

function DoubleTextInput(props: DoubleTextInputProps): JSX.Element {
  const [heightFirstInput, setHeightFirstInput] = useState(40);
  const [heightSecondInput, setHeightSecondInput] = useState(40);

  const updateFirstInputHeight = debounce((height) => {
    setHeightFirstInput(height);
  }, 1); // Adjust the debounce time as needed

  const updateSecondInputHeight = debounce((height) => {
    setHeightSecondInput(height);
  }, 1);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderColor: colors.lightgray,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: colors.white,
      }}
    >
      <View style={styles.container}>
        <TextInput
          style={[
            styles.input,
            { height: Math.max(40, heightFirstInput), borderBottomWidth: 1 },
          ]}
          placeholder="Title"
          placeholderTextColor={colors.gray}
          multiline
          onContentSizeChange={(event) => {
            updateFirstInputHeight(event.nativeEvent.contentSize.height);
          }}
          onChangeText={props.onFirstInputChange}
          value={props.title}
        />
        <TextInput
          style={[
            styles.input,
            {
              height: Math.max(40, heightSecondInput),
              borderBottomWidth: 1,
              borderBottomColor: "white",
            },
          ]}
          placeholder="Content"
          placeholderTextColor={colors.gray}
          multiline
          onContentSizeChange={(event) => {
            updateSecondInputHeight(event.nativeEvent.contentSize.height);
          }}
          onChangeText={props.onSecondInputChange}
          value={props.content}
          // onSubmitEditing={props.onSubmit}
        />
      </View>
      <View style={{ marginLeft: 10 }}>
        {props.loading ? (
          <ActivityIndicator size="small" color={colors.purple} />
        ) : (
          <Icon
            name="paper-plane"
            size={20}
            color={props.submittable ? colors.purple : colors.lightgray}
            onPress={props.submittable ? props.onSubmit : () => {}}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    alignItems: "center", // Aligns items vertically center in the row
  },
  container: {
    flexDirection: "column",
    flex: 1,
  },
  input: {
    borderColor: colors.lightgray,
    padding: 10,
    textAlignVertical: "top", // ensures text starts from the top
    outlineStyle: "none",
  },
});

export default DoubleTextInput;
