import React, { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import colors from "../Styles/colors";
import Text from "./Text";
import ProfileRow from "./ProfileRow";
import DropDownPicker from "react-native-dropdown-picker";
import FeatherIcon from "react-native-vector-icons/Feather";
import AddLeader from "./AddLeader";
import OrFullWidth from "./OrFullWidth";
import { Post, UserProfile } from "../utils/interfaces";
import Icon from "react-native-vector-icons/Feather";
import { customFetch } from "../utils/utils";
import { Endpoints } from "../utils/Endpoints";

interface AssigneesProps {
  leaders: UserProfile[];
  issue: Post;
}

function Assignees(props: AssigneesProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string[]>([]);
  const [items, setItems] = useState([
    { label: "Tanuj Dunthuluri", value: "Tanuj Dunthuluri" },
    { label: "Atishay Jain", value: "Atishay Jain" },
    { label: "Rishi Bengani", value: "Rishi Bengani" },
    { label: "Person New", value: "A Person" },
  ]);

  useEffect(() => {
    const leaders = props.leaders.map((leader) => {
      const isSuggested = isLeaderSuggestedByAI(leader.user);
      const departmentNamesString = leader.departmentNames.join(", ");
      const aiSuggestsTag = isSuggested ? " [AI suggests]" : ""; 

      return {
        label: `${leader.firstName}${departmentNamesString ? `(${departmentNamesString})` : ""}${aiSuggestsTag}`,
        value: leader.email ? leader.email[0] : "atjain02@gmail.com",
      };
    });

    setItems(leaders);
  }, [props.leaders]);
  

  useEffect(() => {
    for (let email of value) {
      sendEmailToLeader(email);
    }
  }, [value])

  const inviteLeader = (name: string, email: string) => {
    setItems([
      ...items,
      {
        label: name,
        value: email,
      },
    ]);

    setValue([...value, email]);
  }

  async function sendEmailToLeader(email: string) {
    try {
      let res: Response = await customFetch(
          Endpoints.sendEmailToLeader,
          {},
          {
              method: "POST",
              body: {
                toLeaderEmail: email,
                postID: props.issue._id,
              },
          }
      );
      if (!res.ok) {
          const resJson = await res.json();
          console.error(resJson.error);
      } else {
          console.log("Email sent to leader");
      }
    } catch (error) {
      console.error("Network error, please try again later.", error);
    }
  }

  const isLeaderSuggestedByAI = (leaderId: string) => {
    // Ensure that there is at least one suggested department and it has leaders
    if (props.issue.suggestedDepartments.length > 0 && props.issue.suggestedDepartments[0].leaders) {
      console.log("First suggested department:", props.issue.suggestedDepartments[0]); // Log the first suggested department
      console.log("Checking for leader ID:", leaderId); // Log the leader ID being checked
  
      return props.issue.suggestedDepartments[0].leaders.some(leader => leader._id === leaderId);
    }
    return false;
  };
  

  return (
    <View
      style={{
        borderColor: colors.lightestgray,
        borderWidth: 2,
        borderRadius: 10,
        padding: 10,
        minHeight: open ? 255 : undefined,
        rowGap: 10,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "550",
          fontFamily: "Montserrat",
        }}
      >
        Assignees
      </Text>
      <DropDownPicker
        maxHeight={165}
        multipleText={`${value.length} ${
          value.length == 1 ? "leader" : "leaders"
        } selected`}
        searchable={true}
        searchTextInputStyle={{
          backgroundColor: colors.white,
          borderColor: colors.lightgray,
          borderWidth: 1,
          borderRadius: 10,
        }}
        searchContainerStyle={{
          borderBottomWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          paddingHorizontal: 4,
          borderBottomColor: colors.lightergray,
        }}
        searchPlaceholder="Search..."
        // addCustomItem={true}
        multiple={true}
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        dropDownDirection="BOTTOM"
        style={{
          borderColor: colors.lightgray,
          borderWidth: 1,
          backgroundColor: colors.white,
          minHeight: 30,
        }}
        placeholder="Select users"
        textStyle={{
          fontSize: 15,
          color: colors.black,
          fontWeight: "500",
          fontFamily: "Montserrat",
        }}
        listMode="SCROLLVIEW"
        dropDownContainerStyle={[
          {
            borderTopWidth: 1,
            backgroundColor: colors.white,
            borderColor: colors.lightgray,
          },
        ]}
        ArrowDownIconComponent={() => (
          <FeatherIcon name={"chevron-down"} size={20} color={colors.gray} />
        )}
        ArrowUpIconComponent={() => (
          <FeatherIcon name={"chevron-up"} size={20} color={colors.gray} />
        )}
        TickIconComponent={() => (
          <FeatherIcon name={"check"} size={17} color={colors.gray} />
        )}
      />
      {value.map((item, index) => {
        return <ProfileRow name={item} key={index} />;
      })}
      <View>
        <OrFullWidth />
        <AddLeader inviteLeader={inviteLeader}/>
      </View>
    </View>
  );
};

export default Assignees;
