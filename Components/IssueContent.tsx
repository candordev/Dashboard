import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import colors from "../Styles/colors";
import { Endpoints } from "../utils/Endpoints";
import { customFetch, formatDate } from "../utils/utils";
import Button from "./Button";
import Text from "./Text";

type IssueContent = {
  title: string;
  content: string;
  issueID: string;
  date: string;
};

const IssueContent: React.FC<IssueContent> = (props) => {
  const [editing, setEditing] = useState(false);

  const [title, setTitle] = useState(props.title);
  const [content, setContent] = useState(props.content);

  const handleDone = async () => {
    try {
      console.log("content", content);
      let res: Response = await customFetch(Endpoints.editPost, {
        method: "POST",
        body: JSON.stringify({
          content: content,
          postID: props.issueID,
          title: title,
        }),
      });

      let resJson = await res.json();
      if (!res.ok) {
        console.error(resJson.error);
      } else {
        setEditing(false);
        console.log("SUCSEFULLY EDDITED");
      }
    } catch (error) {
      console.error("Error loading posts. Please try again later.", error);
    }
    //fetch here
  };

  return (
    <ScrollView
      style={{
        backgroundColor: colors.white,
        padding: 10,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: colors.lightestgray,
        maxHeight: '50%',
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
          <Text
            style={{
              fontSize: 13,
              fontWeight: "500",
              fontFamily: "Montserrat",
              color: "gray",
              marginBottom: 3,
              marginTop: 3,
              //marginLeft: 5,
            }}
          >
            {formatDate(props.date)}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  textInput: {
    fontFamily: "OpenSans",
    outlineStyle: "none",
  },
});

export default IssueContent;
