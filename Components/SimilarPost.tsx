import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import colors from "../Styles/colors";
import Button from "./Button";
import Text from "./Text";
import OuterComponentView from "./PopoverComponentView";
import { customFetch, formatDate } from "../utils/utils";
import { Endpoints } from "../utils/Endpoints";

type SimilarPostProps = {
  title: string;
  content: string;
  date: string;
  ogPostID: string;
  mergePostID: string;
  merged: Boolean
  onClose: () => void;  // Add this callback prop
  //onAction: (action: "join" | "close") => void;

};

const SimilarPost: React.FC<SimilarPostProps> = ({ title, content, date, ogPostID, mergePostID, merged, onClose}) => {

    const [isMerged, setIsMerged] = useState(merged);

    useEffect(() => {
        setIsMerged(merged);
      }, [merged]);

    const handleSimilarPostAction = async (action: "join" | "close" | "unjoin") => {
        try {
          //const merge = action === "join";
          let res = await customFetch(Endpoints.mergePost, {
            method: "POST",
            body: JSON.stringify({
              mergePost: action,
              ogPostID: ogPostID,
              mergePostID: mergePostID
            }),
          });
    
          if (!res.ok) {
            const resJson = await res.json();
            console.error("Error with merging post:", resJson.error);
          } else {
            setIsMerged(action === "join");
            if(action == "close"){
                onClose();  // Call the callback function when X is pressed
            }
          }
        } catch (error) {
          console.error("Network error, please try again later.", error);
        }
      };

  return (
    <OuterComponentView title="Similar Posts" style={{ zIndex: 4 }}>
      <ScrollView
        style={{
          backgroundColor: colors.white,
          padding: 10,
          borderWidth: 2,
          borderRadius: 10,
          borderColor: colors.lightestgray,
          maxHeight: '100%',
        }}
      >
        <View style={styles.titleRow}>
          <Text style={styles.titleText}>
            {title}
          </Text>
          <View style={styles.buttonContainer}>
            {isMerged ? (
                <Button
                    text="Joined"
                    onPress={() => handleSimilarPostAction("unjoin")}
                    style={{
                    backgroundColor: colors.purple,
                    width: 75,
                    height: 30,
                    borderRadius: 10,
                    }}
                    textStyle={{
                    color: colors.white,
                    fontSize: 12,
                    fontWeight: "500",
                    }}
                />
                ) : (
                <>
            <Button
              text="Join"
              onPress={() => handleSimilarPostAction("join")}
              style={{
                backgroundColor: colors.purple,
                width: 40,
                height: 30,
                borderTopRightRadius: 0, // Straight right border
                borderBottomRightRadius: 0, // Straight right border
                borderTopLeftRadius: 10, // Curved left border
                borderBottomLeftRadius: 10, // Curved left border
              }}
              textStyle={{
                color: colors.white,
                fontSize: 12,
                fontWeight: "500",
              }}
            />
            <Button
              text="X"
              onPress={() => {
                handleSimilarPostAction("close");
                
              }}
              style={{
                backgroundColor: colors.red,
                width: 30,
                height: 30,
                borderTopLeftRadius: 0, // Straight left border
                borderBottomLeftRadius: 0, // Straight left border
                borderTopRightRadius: 10, // Curved right border
                borderBottomRightRadius: 10, // Curved right border
              }}
              textStyle={{
                color: colors.white,
                fontSize: 12,
                fontWeight: "500",
              }}
            />
             </>
            )}
          </View>
        </View>
        <Text style={styles.dateText}>
          {formatDate(date)}
        </Text>
        <Text style={styles.contentText}>{content}</Text>
      </ScrollView>
    </OuterComponentView>
  );
};

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 13,
    fontWeight: "500",
    fontFamily: "Montserrat",
    color: "gray",
    marginBottom: 3,
    marginTop: 3,
  },
  contentText: {
    fontSize: 14,
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  // Add any additional styles here if needed
});

export default SimilarPost;
