const AuthenticatedApp = ({ expoPushToken, notification, users, sendPushNotification }) => {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
        <Text>Your expo push token: {expoPushToken}</Text>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text>Title: {notification && notification.request.content.title} </Text>
          <Text>Body: {notification && notification.request.content.body}</Text>
          <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
        </View>
        <Button
          title="Press to Send Notification"
          onPress={async () => {
            await sendPushNotification(expoPushToken);
          }}
        />
        <View style={styles.container}>
          <Text style={styles.heading}>Users</Text>
          <View style={styles.list}>
            {users.map(user => (
              <Text style={styles.user} key={user._id}>{user.username}</Text>
            ))}
          </View>
        </View>
      </View>
    );
  };
  