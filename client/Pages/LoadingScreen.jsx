import React from 'react';
import { View, StyleSheet } from 'react-native';
import BouncingPreloader from 'react-native-bouncing-preloader';

export function LoadingScreen() {
    return (
        <View style={styles.container}>
            <BouncingPreloader
                useNativeDriver={true} // Add this line to specify the useNativeDriver option
                icons={[
                    'react-native-vector-icons/Ionicons',
                    'react-native-vector-icons/FontAwesome',
                    'react-native-vector-icons/MaterialCommunityIcons',
                ]}
                leftDistance={-200}
                rightDistance={-300}
                speed={1200}
                size={40}
                distance={-100}
                color={'#3498db'}
            />
        </View>
    );
}
export default LoadingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
