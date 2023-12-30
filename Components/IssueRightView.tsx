import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ScrollView, View } from "react-native";
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";
import { useUserContext } from "../Hooks/useUserContext";
import colors from "../Styles/colors";
import { Endpoints } from "../utils/Endpoints";
import { Post } from "../utils/interfaces";
import { customFetch } from "../utils/utils";
import Assignees from "./Assignees";
import Category from "./Category";
import MarkDone from "./MarkDone";
import Text from "./Text";
import Deadline from "./Deadline";
import Location from "./Location";

interface IssueRightViewProps {
  fetchStatusUpdates: () => void;
  issue: Post;
}

function IssueRightView(props: IssueRightViewProps): JSX.Element {

  return (
    <ScrollView
      style={{
        borderRadius: 10,
        height: "100%",
        flex: 1,
        //justifyContent: "space-between",
      }}
      contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
    >
      <Assignees issue={props.issue} createPost={false} />
      <Category issueId={props.issue._id} createPost={false} />
      <Deadline issue={props.issue} />
      <Location />
      <View
        style={{
          borderColor: colors.lightestgray,
          borderWidth: 2,
          borderRadius: 10,
          padding: 10,
          rowGap: 5,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "550",
            fontFamily: "Montserrat",
          }}
        >
          Post Details
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "400",
            fontFamily: "Montserrat",
          }}
        >
          {"Post Created From: " + (props.issue.postCreatedFrom ?? "")}
        </Text>
        {props.issue.proposalFromEmail ? (
          <Text
            style={{
              fontSize: 16,
              fontWeight: "400",
              fontFamily: "Montserrat",
            }}
          >
            {"Email: " + props.issue.proposalFromEmail}
          </Text>
        ) : null}
        {(props.issue.userProfile.firstName !== "Candor Website" ||
          props.issue.userProfile.lastName !== "Bot") && (
          <>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "400",
                fontFamily: "Montserrat",
              }}
            >
              {"FirstName: " + (props.issue.userProfile.firstName ?? "")}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "400",
                fontFamily: "Montserrat",
              }}
            >
              {"LastName: " + (props.issue.userProfile.lastName ?? "")}
            </Text>
          </>
        )}
      </View>
      <View style={{ rowGap: 10 }}>
        <MarkDone
          fetchStatusUpdates={props.fetchStatusUpdates}
          issueId={props.issue._id}
          step={props.issue.step}
        />
        {/* <CloseIssue /> */}
      </View>
    </ScrollView>
  );
}

export default IssueRightView;
