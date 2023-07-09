import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import PropTypes from 'prop-types';
import COLORS from '../constants/colors';
import Button from '../Components/UI/Button';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';

const Welcome = ({ navigation }) => {
  return (
    <LinearGradient
      style={styles.container}
      colors={[COLORS.secondary, COLORS.primary]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/images/cleaning.png")}
          style={styles.firstImage}
        />

        <Image
          source={require("../assets/images/task1.png")}
          style={styles.secondImage}
        />

        <Image
          source={require("../assets/images/studdy.png")}
          style={styles.thirdImage}
        />

        <Image
          source={require("../assets/images/logo.jpg")}
          style={styles.fourthImage}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>Let's Get</Text>
        <Text style={styles.subtitle}>Started</Text>

        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            Take control of your time and unlock the power of productivity.
          </Text>
          <Text style={styles.description}>
            Set tasks, organize your schedule, and make the most out of every moment.
          </Text>
         
        </View>
      
        <Button
          title="Join Now"
          onPress={() => navigation.navigate("Signup")}
          style={styles.button}
        />

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account ?</Text>
          <Pressable onPress={() => navigation.navigate("Login")}>
            <Text style={[styles.loginText, { textDecorationLine: 'underline' }]}>Login</Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
};

Welcome.propTypes = {
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  firstImage: {
    height: 100,
    width: 100,
    borderRadius: 20,
    position: "absolute",
    top: 10,
    transform: [
      { translateX: 20 },
      { translateY: 50 },
      { rotate: "-15deg" }
    ],
  },
  secondImage: {
    height: 120,
    width: 100,
    borderRadius: 20,
    position: "absolute",
    top: -10,
    left: 100,
    transform: [
      { translateX: 50 },
      { translateY: 50 },
      { rotate: "-5deg" }
    ],
  },
  thirdImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
    position: "absolute",
    top: 130,
    left: -50,
    transform: [
      { translateX: 50 },
      { translateY: 50 },
      { rotate: "15deg" }
    ],
  },
  fourthImage: {
    height: 200,
    width: 200,
    borderRadius: 20,
    position: "absolute",
    top: 110,
    left: 100,
    transform: [
      { translateX: 50 },
      { translateY: 50 },
      { rotate: "-15deg" }
    ],
  },
  textContainer: {
    paddingHorizontal: 22,
    top: 100,
    width: "100%",
  },
  title: {
    fontSize: 50,
    fontWeight: '800',
    color: COLORS.white,
  },
  subtitle: {
    fontSize: 46,
    fontWeight: '800',
    color: COLORS.white,
  },
  descriptionContainer: {
    marginVertical: 22,
  },
  description: {
    fontSize: 14,
    color: COLORS.white,
    marginVertical: 5,
  },
  button: {
    marginTop: 22,
    borderRadius: 20,
    backgroundColor: "#D5E8D4",
  },
  loginContainer: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "center",
  },
  loginText: {
    fontSize: 16,
    color: COLORS.white,
  },
  bold: {
    fontWeight: "bold",
    marginLeft: 4,
  },
});

export default Welcome;
