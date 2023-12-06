import React, { useEffect, useState } from "react";
import { View } from "react-native";
import Text from "./Text";
import colors from "../Styles/colors";
import ProfileRow from "./ProfileRow";
import Assignees from "./Assignees";
import Category from "./Category";
import MarkDone from "./MarkDone";
import CloseIssue from "./CloseIssue";
import SendTo from "./AddLeader";
import { Post, UserProfile } from "../utils/interfaces";
import { Endpoints } from "../utils/Endpoints";
import { constants } from "../utils/constants";
import { customFetch } from "../utils/utils";

interface IssueRightViewProps {
    issue: Post;
}

function IssueRightView(props: IssueRightViewProps): JSX.Element {
    const [leaders, setLeaders] = useState<UserProfile[]>([]);

    useEffect(() => {
      fetchLeaders();
    }, []);

    const fetchLeaders = async () => {
        try {
            let endpoint: string;
            endpoint = Endpoints.getGroupLeaders;

            const res: Response = await customFetch(
                endpoint,
                {
                    page: "1",
                    groupID: constants.GROUP_ID,
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
                const result: UserProfile[] = resJson;
                console.log("leaders are", result);
                setLeaders(result);
            }
        } catch (error) {
            console.error("Error loading posts. Please try again later.", error);
        }
    };

    const suggestedDepartmentName = props.issue.suggestedDepartments?.[0]?.name || "No Department Suggested";

    return (
        <View
            style={{
                height: "100%",
                flex: 1,
                justifyContent: "space-between",
            }}
        >
            <View style={{ rowGap: 10 }}>
                <Assignees leaders={leaders} issue={props.issue}/>
                <Category />
                <View style={{ marginTop: 10}}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', fontFamily: 'Montserrat' }}>
                    Candor Suggested To:
                    </Text>
                    <Text style={{ fontSize: 14, fontFamily: 'Montserrat' }}>
                    {suggestedDepartmentName}
                    </Text>
                </View>
            </View>          
            <View style={{ rowGap: 10 }}>
                <MarkDone />
                <CloseIssue />
            </View>
        </View>
    );
}

export default IssueRightView;
