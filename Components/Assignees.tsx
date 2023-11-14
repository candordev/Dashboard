import React, { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import colors from "../Styles/colors";
import Text from "./Text";
import ProfileRow from "./ProfileRow";
import DropDownPicker from "react-native-dropdown-picker";
import FeatherIcon from "react-native-vector-icons/Feather";
import AddLeader from "./AddLeader";
import OrFullWidth from "./OrFullWidth";
import { UserProfile } from "../utils/interfaces";
import Icon from "react-native-vector-icons/Feather";

interface AssigneesProps {
  leaders: UserProfile[];
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
      return {
        label: leader.firstName + " " + leader.lastName,
        value: "hello",
        // value: leader.firstName + " " + leader.lastName,
      };
    });

    setItems(leaders);
  }, [props.leaders]);

  const inviteLeader = (name: string) => {
    setItems([
      ...items,
      {
        label: name,
        value: name,
      },
    ]);

    setValue([...value, name]);
  }

  function assignLeaders() {
    console.log("Assigning leaders", value);
  }

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
      <Pressable
        style={{padding: 10, alignSelf: "flex-end", marginTop: 1}}
        onPress={() => {
          assignLeaders();
        }}>
        <Icon name="send" size={20} color={colors.gray} />
      </Pressable>
      <View>
        <OrFullWidth />
        <AddLeader inviteLeader={inviteLeader}/>
      </View>
    </View>
  );
};

export default Assignees;
