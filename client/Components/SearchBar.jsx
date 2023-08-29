import { TextInput, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../constants/colors';
export default function SearchBar({ value, onChangeText }) {
    return (
        <SafeAreaView>
            <TextInput
                style={styles.searchInput}
                placeholder="Search ..."
                value={value}
                onChangeText={onChangeText}>
            </TextInput>
        </SafeAreaView >
    )
};

const styles = StyleSheet.create({
    searchInput: {
        // backgroundColor: 'white',
        backgroundColor: COLORS.white,
        borderRadius: 23,
        margin: 10,
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 5,
        // elevation:40,
    },
});