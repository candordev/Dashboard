import React, { useState } from 'react';
import colors from "../Styles/colors";
import { View, Text, TouchableOpacity, TextInput, Linking, StyleSheet } from 'react-native';

const SmsOptInOut = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isOptedIn, setIsOptedIn] = useState(false);

  const handleOptIn = () => {
    setIsOptedIn(true);
    // Here you can add logic to handle the opt-in action, e.g., API call
  };

  const handleOptOut = () => {
    setIsOptedIn(false);
    // Here you can add logic to handle the opt-out action, e.g., API call
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join the Club!</Text>
      <Text style={styles.subtitle}>
        Get access to announcements and updates. Ask anything, our chat bot will respond.
      </Text>
      <TextInput
        style={styles.textInput}
        placeholder="Enter your phone number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      {!isOptedIn ? (
        <TouchableOpacity style={styles.button} onPress={handleOptIn}>
          <Text style={styles.buttonText}>Sign up for SMS</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleOptOut}>
          <Text style={styles.buttonText}>Opt out of SMS</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.optInInfo}>
        By submitting this form and signing up for texts, you consent to receive marketing text messages (e.g., promos, cart reminders) from Twilio autodialer. Consent is not a condition of purchase. Msg & data rates may apply. Msg frequency varies. Unsubscribe at any time by replying STOP.
      </Text>
      <TouchableOpacity onPress={() => Linking.openURL('https://www.candornow.com/legalterms')}>
        <Text style={styles.linkText}>Privacy Policy & Terms</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  textInput: {
    width: '100%',
    height: 40,
    borderColor: '#d3d3d3',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: colors.purple,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  optInInfo: {
    fontSize: 12,
    color: '#808080',
    marginTop: 20,
    textAlign: 'center',
  },
  linkText: {
    color: '#0000ff',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});

export default SmsOptInOut;
