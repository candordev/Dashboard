
import React from 'react';
import { View, TouchableOpacity} from 'react-native';
import Text from './Text';

const LHN = () => {
  const handleNavigation = (screenName: string) => {
    // Handle navigation logic here
    console.log(`Navigating to ${screenName}`);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handleNavigation('Home')}
      >
        <Text style={styles.navItemText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handleNavigation('Profile')}
      >
        <Text style={styles.navItemText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handleNavigation('Settings')}
      >
        <Text style={styles.navItemText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  navItem: {
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
  },
  navItemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
};

export default LHN;
