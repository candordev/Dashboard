import React, { useEffect } from "react";
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
    const [updates, setUpdates] = React.useState<Update[]>([]);

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
            <DoubleTextInput />
        </View>
    );
}

export default IssueMiddleView;
