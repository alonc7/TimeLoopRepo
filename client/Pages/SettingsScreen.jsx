import React from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you have installed the Ionicons package for icons
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = ({ navigation }) => {
  const [isNotificationEnabled, setIsNotificationEnabled] = React.useState(false);
  const [isDarkModeEnabled, setIsDarkModeEnabled] = React.useState(false);
  const [isDarkFunEnabled, setIsDarkFunEnabled] = React.useState(false);

  const handleNotificationToggle = () => {
    setIsNotificationEnabled((prevValue) => !prevValue);
  };

  const handleDarkModeToggle = () => {
    setIsDarkModeEnabled((prevValue) => !prevValue);
  };

  const handleFunModeToggle = () => {
    setIsDarkFunEnabled((prevValue) => !prevValue);
  };

  // Your logout function (you can implement the logic here)
  const removeDataFromAsyncStorage = async () => {
    try {
      await AsyncStorage.removeItem('userData');
    } catch (error) {
      console.log('Error removing user data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Settings</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionHeaderText}>General</Text>
        <View style={styles.setting}>
          <Text style={styles.settingText}>Notifications</Text>
          <Switch
            value={isNotificationEnabled}
            onValueChange={handleNotificationToggle}
          />
        </View>
        <View style={styles.setting}>
          <Text style={styles.settingText}>Dark Mode</Text>
          <Switch value={isDarkModeEnabled} onValueChange={handleDarkModeToggle} />
        </View>
        <View style={styles.setting}>
          <Text style={styles.settingText}>FUN Mode</Text>
          <Switch value={isDarkFunEnabled} onValueChange={handleFunModeToggle} />
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={removeDataFromAsyncStorage}>
        <Ionicons name="log-out-outline" size={24} color="#1976D2" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 18,
  },
  header: {
    height: 70,
    backgroundColor: '#1976D2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  settingText: {
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  logoutButtonText: {
    marginLeft: 10,
    color: '#1976D2',
    fontSize: 16,
  },
});

export default SettingsScreen;
