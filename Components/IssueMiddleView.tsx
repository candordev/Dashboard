import React, { useEffect, useState } from "react";
import { ScrollView, TextInput, View, StyleSheet } from "react-native";
import Text from "./Text";
import colors from "../Styles/colors";
import UpdateCard from "./UpdateCard";
import DoubleTextInput from "./DoubleTextInput";
import { Post, Update } from "../utils/interfaces";
import { customFetch } from "../utils/utils";
import { Endpoints } from "../utils/Endpoints";



interface IssueMiddleViewProps {
  issue: Post;
  updateTrigger: Boolean; 
}

function IssueMiddleView(props: IssueMiddleViewProps): JSX.Element {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errorMessage, setMessage] = useState("");

  // useEffect(() => {
  //   console.log("INFNITE LOOP D");
  //   fetchStatusUpdates();
  // }, []);

  useEffect(() => {
    fetchStatusUpdates();
  }, [props.updateTrigger]); // Dependency on updateTrigger

  const fetchStatusUpdates = async () => {
    try {
      let endpoint: string;
      endpoint =
        Endpoints.getPostProgress +
        new URLSearchParams({
          postID: props.issue._id,
        });

      const res: Response = await customFetch(endpoint, {
        method: "GET",
      });

      const resJson = await res.json();
      if (!res.ok) {
        console.error(resJson.error);
      }
      if (res.ok) {
        const result: Update[] = resJson;
        console.log("status updates are", result);
        setUpdates([...result]);
        setTitle('')
        setContent('')
      }
    } catch (error) {
      console.error("Error loading posts. Please try again later.", error);
    }
  };

  const addUpdate = async () => {
    try {
      let res: Response = await customFetch(Endpoints.createStatusUpdate, {
        method: "POST",
        body: JSON.stringify({
          title: title,
          content: content,
          postID: props.issue._id,
          completed: false,
        }),
      });

      if (!res.ok) {
        const resJson = await res.json();
        console.error("Status update error", resJson.error);
        setMessage(resJson.error)
      } else {
        await fetchStatusUpdates();
      }
    } catch (error) {
      console.error("Network error, please try again later.", error);
    }
  };

  return (
    <View
      style={{
        borderColor: colors.lightestgray,
        borderWidth: 2,
        borderRadius: 10,
        height: "100%",
        flex: 1,
        padding: 10,
        justifyContent: "space-between",
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "550",
          fontFamily: "Montserrat",
          marginBottom: 10,
        }}
      >
        Status Updates
      </Text>
      <ScrollView contentContainerStyle={{ rowGap: 10, paddingBottom: 20 }}>
        {updates.map((update, index) => (
          <UpdateCard key={index} update={update} />
        ))}
      </ScrollView>
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      <DoubleTextInput
        onFirstInputChange={setTitle}
        onSecondInputChange={setContent}
        onSubmit={addUpdate} // Pass the addUpdate function
      />
    </View>
  );
}
const styles = StyleSheet.create({

  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'left',
    marginTop: 5,
    marginLeft: 0,
    fontFamily: "Montserrat",
  },
  // ... other styles ...
});

export default IssueMiddleView;

