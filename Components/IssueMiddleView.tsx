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
}

function IssueMiddleView(props: IssueMiddleViewProps): JSX.Element {
    const [updates, setUpdates] = useState<Update[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        fetchStatusUpdates();
    }, []);

    const fetchStatusUpdates = async () => {
        try {
            const res: Response = await customFetch(
                Endpoints.getPostProgress,
                {
                    postID: props.issue._id,
                },
                {
                    method: "GET",
                }
            );

            const resJson = await res.json();
            if (!res.ok) {
                console.error(resJson.error);
            }
            if (res.ok) {
                const result: Update[] = resJson;
                console.log("status updates are", result);
                setUpdates([...result]);
            }
        } catch (error) {
            console.error(
                "Error loading posts. Please try again later.",
                error
            );
        }
    };

    const addUpdate = async () => {
        try {
            let res: Response = await customFetch(
                Endpoints.createStatusUpdate,
                {},
                {
                    method: "POST",
                    body: {
                      title: title,
                      content: content,
                      postID: props.issue._id,
                      completed: false,
                    },
                }
            );
            if (!res.ok) {
                const resJson = await res.json();
                console.error(resJson.error);
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
            <ScrollView
                contentContainerStyle={{ rowGap: 10, paddingBottom: 20 }}
            >
                {updates.map((update, index) => (
                    <UpdateCard key={index} update={update} />
                ))}
            </ScrollView>
            <DoubleTextInput
                onFirstInputChange={setTitle}
                onSecondInputChange={setContent}
                onSubmit={addUpdate}
            />
        </View>
    );
}

export default IssueMiddleView;
