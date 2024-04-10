import React, { useState } from 'react'; // Import useState hook
import { Modal, View, StyleSheet, ActivityIndicator } from 'react-native';
import Text from './Text'; // Assuming Text is a custom component.
import Button from './Button'; // Assuming Button is a custom component.
import colors from '../Styles/colors';

interface ConfirmationModalProps {
  isVisible: boolean;
  onConfirm: () => Promise<void>; // Assuming onConfirm is async
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isVisible,
  onConfirm,
  onCancel,
}) => {
  const [isPosting, setIsPosting] = useState(false);
  
  const handleConfirm = async () => {
    setIsPosting(true); // Start the loader
    try {
      await onConfirm(); // Wait for the post request to complete
    } finally {
      setIsPosting(false); // Stop the loader regardless of the result
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onCancel}>
      <View style={additionalStyles.centeredView}>
        <View style={additionalStyles.modalView}>
          {isPosting ? (
            <ActivityIndicator size="large" color={colors.purple} />
          ) : (
            <>
              <Text
                style={{
                  fontFamily: "Montserrat",
                  marginBottom: 25,
                  fontSize: 20,
                  textAlign: 'center',
                  flexShrink: 1,
                }}>
                Are you sure you want to send this email to the constituent?
              </Text>
              <View style={additionalStyles.buttonContainer}>
                <Button
                  text="Cancel"
                  textStyle={{marginHorizontal: 20}}
                  style={{
                    backgroundColor: colors.red,
                    borderRadius: 10,
                  }}
                  onPress={onCancel}
                />
                <Button
                  text="Send"
                  textStyle={{marginHorizontal: 20}}
                  style={{
                    backgroundColor: colors.purple,
                    borderRadius: 10,
                  }}
                  onPress={handleConfirm}
                />
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;

const additionalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "75%",
  },
});
