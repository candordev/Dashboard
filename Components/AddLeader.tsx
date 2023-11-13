import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

import colors from "../Styles/colors";

import Text from "./Text";

const AddLeader = (props : {inviteLeader : (name : string) => void}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={{ rowGap: 10 }}>
      {expanded && (
        <>
          <TextInput
            placeholder="First Name"
            placeholderTextColor={colors.gray}
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
          />
          <TextInput
            placeholder="Last Name"
            placeholderTextColor={colors.gray}
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor={colors.gray}
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
        </>
      )}
      <TouchableOpacity
        style={{
          backgroundColor: colors.purple,
          borderRadius: 10,
          paddingVertical: 8,
          alignItems: "center",
        }}
        onPress={() => {
          if (expanded) {
            props.inviteLeader(`${firstName} ${lastName}`)
            setExpanded(false);
          } else {
            setExpanded(true);
          }
        }}
      >
        <Text
          style={{
            fontFamily: "Montserrat",
            color: colors.white,
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          {expanded ? 'Done' : 'Add Leader'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderBottomColor: colors.lightgray,
    borderBottomWidth: 1,
    padding: 10,
    paddingHorizontal: 5,
    marginHorizontal: 5,
    flex: 1,
    height: 30,
    outlineStyle: "none",
  },
});

export default AddLeader;
