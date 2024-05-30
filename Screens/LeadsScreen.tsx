import React, { useState } from "react";
import { View, TextInput, StyleSheet, Image, Pressable } from "react-native";
import colors from "../Styles/colors";
import Text from "../Components/Text";
import { Link, useNavigation } from "@react-navigation/native";
import Button from "../Components/Button";
//import auth from '@react-native-firebase/auth';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Icon from "react-native-vector-icons/Feather";
import styles from "../Styles/styles";
import OuterView from "../Components/OuterView";
import ContactsTable from "../Components/ContactsTable";
import { useUserContext } from "../Hooks/useUserContext";
import { ScrollView } from "react-native-gesture-handler";

const LeadsScreen = ({ navigation }: any) => {
  const { state, dispatch } = useUserContext();
  return (
    <OuterView style={{backgroundColor: colors.white}}>
        <ScrollView>
            <ContactsTable groupID={state.currentGroup} navigation={navigation}/>
        </ScrollView>
    </OuterView>
  );
};

const currStyles = StyleSheet.create({

});

export default LeadsScreen;
