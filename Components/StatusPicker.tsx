import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../Styles/colors";
import { useState } from "react";

const StatusPicker = () => {
  const [newSelected, setNewSelected] = useState(true);
  const [assignedSelected, setAssignedSelected] = useState(true);
  const [updatedSelected, setUpdatedSelected] = useState(false);
  const [completedSelected, setCompletedSelected] = useState(false);

  return (
    <View style={styles.container}>
      <SelectableButton
        name={"New"}
        selected={newSelected}
        setSelected={setNewSelected}
      />
      <SelectableButton
        name={"Assigned"}
        selected={assignedSelected}
        setSelected={setAssignedSelected}
      />
      <SelectableButton
        name={"Updated"}
        selected={updatedSelected}
        setSelected={setUpdatedSelected}
      />
      <SelectableButton
        name={"Completed"}
        selected={completedSelected}
        setSelected={setCompletedSelected}
      />
    </View>
  );
};

type PropType = {
  name: string;
  selected: boolean;
  setSelected: (selected: boolean) => void;
};

const SelectableButton = (props: PropType) => {
  return (
    <TouchableOpacity
      onPress={() => props.setSelected(!props.selected)}
      style={[
        styles.button,
        {
          backgroundColor: props.selected ? colors.black : colors.lightestgray,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: props.selected ? colors.white : colors.black },
        ]}
      >
        {props.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightestgray,
    borderRadius: 15,
    flexDirection: "row",
    columnGap: 7,
    height: 37,
  },
  button: { borderRadius: 15, paddingHorizontal: 10, justifyContent: "center" },
  text: { fontWeight: "500" },
});

export default StatusPicker;
