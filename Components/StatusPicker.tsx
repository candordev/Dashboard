import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../Styles/colors";
import { useEffect, useRef, useState } from "react";
import { Status } from "../utils/interfaces";

interface StatusPickerProps {
  onStatusChange: (status: Status) => void;
  status: {
    newSelected: boolean;
    assignedSelected: boolean;
    updatedSelected: boolean;
    completedSelected: boolean;
  };
  setStatus: (status: {
    newSelected?: boolean;
    assignedSelected?: boolean;
    updatedSelected?: boolean;
    completedSelected?: boolean;
  }) => void;
}


const StatusPicker = ({ onStatusChange, status, setStatus }: StatusPickerProps) => {
  const prevStatusRef = useRef<Status>();
  useEffect(() => {
    const prevStatus = prevStatusRef.current;
    const currentStatus = status;

    if (JSON.stringify(prevStatus) !== JSON.stringify(currentStatus)) {
      onStatusChange(currentStatus);
    }

    prevStatusRef.current = currentStatus;
  }, [status, onStatusChange]);

  // Function to handle setting individual status
  const handleSetStatus = (key: keyof Status, value: boolean) => {
    setStatus({ ...status, [key]: value });
  };

  return (
    <View style={styles.container}>
      <SelectableButton
        name="New"
        selected={status.newSelected}
        setSelected={() => handleSetStatus('newSelected', !status.newSelected)}
      />
      <SelectableButton
        name="Assigned"
        selected={status.assignedSelected}
        setSelected={() => handleSetStatus('assignedSelected', !status.assignedSelected)}
      />
      <SelectableButton
        name="Updated"
        selected={status.updatedSelected}
        setSelected={() => handleSetStatus('updatedSelected', !status.updatedSelected)}
      />
      <SelectableButton
        name="Completed"
        selected={status.completedSelected}
        setSelected={() => handleSetStatus('completedSelected', !status.completedSelected)}
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
      onPress={() => {
        props.setSelected(!props.selected);
      }}
      style={[
        styles.button,
        {
          backgroundColor: props.selected ? colors.black : colors.darkerBackground,
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
    zIndex: 0,
    backgroundColor: colors.darkerBackground,
    borderRadius: 15,
    flexDirection: "row",
    columnGap: 7,
    height: 37,
  },
  button: { borderRadius: 15, paddingHorizontal: 10, justifyContent: "center" },
  text: { fontWeight: "550" as any },
});

export default StatusPicker;
