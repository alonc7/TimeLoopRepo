import React, { useState } from 'react';
import {
    View,
    Text,
    Pressable,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import Button from '../Components/UI/Button';
import COLORS from '../constants/colors';
import { ScrollView } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Server_path } from '../utils/api-url';

const SignupSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirm: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm password is required'),
    birthdate: Yup.string().matches(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/, 'Invalid birthdate format (YYYY-MM-DD)').required('Birthdate is required'),
});

const Signup = ({ navigation }) => {
    const [checked, setChecked] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleFormSubmit = async (values) => {
        handleSignUp(
            values.email,
            values.firstName,
            values.lastName,
            values.password,
            values.birthdate)
    };
    // modify security with server name.
    const handleSignUp = async (email, firstName, lastName, password, birthdate) => {
        try {
            const response = await fetch(`${Server_path}/api/users/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, firstName, lastName, password, birthdate }),
            });
            if (response.ok) {
                navigation.navigate('Login');
            } else {
                const data = await response.json();
                console.log(data);
                // setSignInStatus(data.message);
            }
        } catch (error) {
            // Handle network errors or other exceptions
            console.error('Error signing up:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Formik
                    initialValues={{
                        email: '',
                        firstName: '',
                        lastName: '',
                        password: '',
                        confirm: '',
                        birthdate: '',
                    }}
                    validationSchema={SignupSchema}
                    onSubmit={handleFormSubmit}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <View style={styles.innerContainer}>
                            <View style={styles.headingContainer}>
                                <Text style={styles.headingText}>Create Account</Text>
                                <Text style={styles.subHeadingText}>Start making each minute count today!</Text>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Email address</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons
                                        name="mail-outline"
                                        size={24}
                                        color={COLORS.black}
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        name="email"
                                        onChangeText={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                        value={values.email}
                                        placeholder="Enter your email address"
                                        placeholderTextColor={COLORS.black}
                                        keyboardType="email-address"
                                        style={[styles.input, touched.email && errors.email ? styles.inputError : null]}
                                    />
                                </View>
                                {touched.email && errors.email && (
                                    <Text style={styles.errorText}>{errors.email}</Text>
                                )}
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>First Name</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons
                                        name="person-outline"
                                        size={24}
                                        color={COLORS.black}
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        name="firstName"
                                        onChangeText={handleChange('firstName')}
                                        onBlur={handleBlur('firstName')}
                                        value={values.firstName}
                                        placeholder="Enter your first name here"
                                        placeholderTextColor={COLORS.black}
                                        keyboardType="default"
                                        style={[styles.input, touched.firstName && errors.firstName ? styles.inputError : null]}
                                    />
                                </View>
                                {touched.firstName && errors.firstName && (
                                    <Text style={styles.errorText}>{errors.firstName}</Text>
                                )}
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Last Name</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons
                                        name="person-outline"
                                        size={24}
                                        color={COLORS.black}
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        name="lastName"
                                        onChangeText={handleChange('lastName')}
                                        onBlur={handleBlur('lastName')}
                                        value={values.lastName}
                                        placeholder="Enter your last name"
                                        placeholderTextColor={COLORS.black}
                                        keyboardType="default"
                                        style={[styles.input, touched.lastName && errors.lastName ? styles.inputError : null]}
                                    />
                                </View>
                                {touched.lastName && errors.lastName && (
                                    <Text style={styles.errorText}>{errors.lastName}</Text>
                                )}
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Password</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons
                                        name="lock-closed"
                                        size={24}
                                        color={COLORS.black}
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        name="password"
                                        onChangeText={handleChange('password')}
                                        onBlur={handleBlur('password')}
                                        value={values.password}
                                        placeholder="Enter your password"
                                        placeholderTextColor={COLORS.black}
                                        secureTextEntry={!showPass}
                                        style={[styles.input,
                                        touched.password && errors.password ? styles.inputError : null]}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPass(!showPass)}
                                        style={styles.eyeIconContainer}
                                    >
                                        <Ionicons
                                            name={showPass ? "eye" : "eye-off"}
                                            size={24}
                                            color={COLORS.black}
                                            style={styles.inputIcon}
                                        />
                                    </TouchableOpacity>
                                </View>
                                {touched.password && errors.password && (
                                    <Text style={styles.errorText}>{errors.password}</Text>
                                )}
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Confirm Password</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons
                                        name="lock-closed-outline"
                                        size={24}
                                        color={COLORS.black}
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        name="confirm"
                                        onChangeText={handleChange('confirm')}
                                        onBlur={handleBlur('confirm')}
                                        value={values.confirm}
                                        placeholder="Confirm your password"
                                        placeholderTextColor={COLORS.black}
                                        secureTextEntry={!showConfirm}
                                        style={[styles.input, touched.confirm && errors.confirm ? styles.inputError : null]}
                                    />

                                    <TouchableOpacity

                                        onPress={() => setShowConfirm(!showConfirm)}
                                        style={styles.eyeIconContainer}>
                                        <Ionicons
                                            name={showConfirm ? "eye" : "eye-off"}
                                            size={24}
                                            color={COLORS.black}
                                            style={styles.inputIcon}
                                        />
                                    </TouchableOpacity>

                                </View>
                                {touched.confirm && errors.confirm && (
                                    <Text style={styles.errorText}>{errors.confirm}</Text>
                                )}
                            </View>

                            {/* <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Birthdate</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons
                                        name="calendar-outline"
                                        size={24}
                                        color={COLORS.black}
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        name="birthdate"
                                        onChangeText={handleChange('birthdate')}
                                        onBlur={handleBlur('birthdate')}
                                        value={values.birthdate}
                                        maxLength={10}
                                        placeholder="YYYY-MM-DD"
                                        placeholderTextColor={COLORS.black}
                                        keyboardType="phone-pad"
                                        style={[styles.input, touched.birthdate && errors.birthdate ? styles.inputError : null]}
                                    />
                                </View>
                                {touched.birthdate && errors.birthdate && (
                                    <Text style={styles.errorText}>{errors.birthdate}</Text>
                                )}
                            </View> */}

                            <View style={styles.checkboxContainer}>
                                <TouchableOpacity onPress={() => setChecked(!checked)} style={styles.checkboxWrapper}>
                                    <Checkbox
                                        style={styles.checkbox}
                                        value={checked}
                                        onPress={() => setChecked(!checked)}
                                        color={values.checked ? COLORS.primary : undefined}
                                    />
                                    <Text style={styles.checkboxLabel}>
                                        I agree to the terms and conditions
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <Button
                                title="SIGN UP"
                                onPress={handleSubmit}
                                // filled
                                style={styles.signupButton}
                            />

                            <View style={styles.loginContainer}>
                                <Text style={styles.loginText}>Already have an account? </Text>
                                <Pressable onPress={() => navigation.navigate('Login')}>
                                    <Text style={[styles.loginLink, { textDecorationLine: 'underline' }]}>Login </Text>
                                </Pressable>
                            </View>
                        </View>
                    )}
                </Formik>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Signup;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    innerContainer: {
        flex: 1,
        marginHorizontal: 22,
    },

    headingText: {
        fontSize: 22,
        fontWeight: 'bold',
        marginVertical: 12,
        color: COLORS.primary,
    },
    subHeadingText: {
        fontSize: 16,
        color: COLORS.secondary,
    },
    inputContainer: {
        marginBottom: 12,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '400',
        marginVertical: 8,
    },
    inputWrapper: {
        width: '100%',
        height: 48,
        borderColor: COLORS.black,
        borderWidth: 1,
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 22,
    },
    input: {
        flex: 1,
    },
    inputIcon: {
        marginRight: 10
    },
    inputError: {
        borderColor: 'red'
    },
    errorText: {
        color: 'red',
        marginTop: 4
    },
    mobileNumberInput: {
        width: '80%',
    },
    eyeIconContainer: {
        position: 'absolute',
        right: 12,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
    },
    checkboxWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        marginRight: 8,
    },
    checkboxLabel: {
        fontSize: 11,
        color: COLORS.black,
    },

    signupButton: {
        marginTop: 18,
        marginBottom: 4,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.grey,
        marginHorizontal: 10,
    },
    dividerText: {
        fontSize: 14,
    },
    socialSignupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 12,
    },
    socialSignupButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        height: 52,
        borderWidth: 1,
        borderColor: COLORS.grey,
        marginRight: 4,
        borderRadius: 10,
    },
    socialSignupIcon: {
        height: 36,
        width: 36,
        marginRight: 8,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 22,
    },
    loginText: {
        fontSize: 16,
        color: COLORS.black,
    },
    loginLink: {
        fontSize: 16,
        color: COLORS.primary,
        fontWeight: 'bold',
        marginLeft: 6,
    },
    signinMessage: {
        backgroundColor: '#f8f8f8',
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
    },
    signinMessageText: {
        margin: 0,
        fontWeight: 'bold',
        color: '#333',
    },
});
