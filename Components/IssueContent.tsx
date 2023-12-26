import React, { useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import colors from "../Styles/colors";
import Text from "./Text";
import Button from "./Button";
import { ScrollView, TextInput } from "react-native-gesture-handler";

type IssueContent = {
  title: string;
  content: string;
};

const IssueContent: React.FC<IssueContent> = (props) => {
  const [editing, setEditing] = useState(false);

  const [title, setTitle] = useState(props.title);
  const [content, setContent] = useState(props.content);

  const handleDone = () => {
    setEditing(false);
    //fetch here
  };

  return (
    <View
      style={{
        backgroundColor: colors.white,
        padding: 10,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: colors.lightestgray,
      }}
    >
      {editing ? (
        <View>
          <TextInput
            style={[
              {
                fontSize: 18,
                fontWeight: "bold",
                marginRight: 55,
                fontFamily: "OpenSans"
              },
              styles.textInput,
            ]}
            value={title}
            onChangeText={(text) => setTitle(text)}
            autoFocus={true}
            multiline={true}
            numberOfLines={title.length / 20 + 1}
          />
          <TextInput
            style={[
              {
                fontSize: 14,
                marginTop: 5,
                fontFamily: "OpenSans"
              },
              styles.textInput,
            ]}
            value={content}
            onChangeText={(text) => setContent(text)}
            multiline={true}
            numberOfLines={content.length / 30 + 1}
          />
        </View>
      ) : (
        <>
          <Text
            style={{ fontSize: 18, fontWeight: "bold", paddingRight: 55 }}
            onayout={() => {}}
          >
            {title}
          </Text>
          <Text style={{ fontSize: 14, marginTop: 5 }}>{content}</Text>
        </>
      )}
      <Button
        text={editing ? "Done" : "Edit"}
        onPress={() => {
          if (editing) {
            handleDone();
          } else {
            setEditing(true);
          }
        }}
        style={{
          position: "absolute",
          top: 5,
          right: 5,
          backgroundColor: editing ? colors.purple : colors.lightestgray,
          width: 50,
          height: 30,
        }}
        textStyle={{
          color: editing ? colors.white : colors.black,
          fontSize: 14,
          fontWeight: "500",
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    outlineStyle: "none",
  },
});

export default IssueContent;
