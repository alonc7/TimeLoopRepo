import { StyleSheet, View, Text, Pressable, Button } from "react-native";

function GoalItem(props) {

    function handleDeleteItem(props) {
        return () => {
            props.onDeleteItem(props.id);
        };
    }
    return (
        < Pressable
            android_ripple={{ color: '#8e41413c3c' }}
        >
            <View style={styles.goalItem}>
                <Text style={styles.goalItem}>{(props.text)}</Text>
                <Text style={styles.goalItem}>{(props.startDate)}</Text>
                <Text style={styles.goalItem}>{(props.dueDate)}</Text>
                <Button
                    onPress={handleDeleteItem(props)}
                    title="✖️"></Button>
            </View>
        </Pressable >
    )
};

export default GoalItem;

const styles = StyleSheet.create({
    goalItem: {
        margin: 8,
        padding: 2,
        borderRadius: 6,
        backgroundColor: '#5b55ab',
    },

    goalText: {
        color: 'white'
    },
    pressedItem: { // style for IOS.
        opacity: 0.5
    },

})
