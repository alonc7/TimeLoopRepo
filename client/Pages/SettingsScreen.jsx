import React from 'react';
import { StyleSheet, View, Text, Switch } from 'react-native';

const SettingsScreen = () => {
  const [isNotificationEnabled, setIsNotificationEnabled] = React.useState(false);
  const [isDarkModeEnabled, setIsDarkModeEnabled] = React.useState(false);

  const handleNotificationToggle = () => {
    setIsNotificationEnabled((prevValue) => !prevValue);
    
  };

  const handleDarkModeToggle = () => {
    setIsDarkModeEnabled((prevValue) => !prevValue);
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop:18
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
});

export default SettingsScreen;
