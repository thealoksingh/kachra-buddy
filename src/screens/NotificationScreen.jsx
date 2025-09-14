import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '../styles/commonStyles';
import { CommonAppBar } from '../components/commonComponents';
import { useNavigation } from '@react-navigation/native';
import { fetchNotifications, markNotificationAsRead, deleteNotification } from '../store/thunks/notificationThunk';
import { removeNotification, updateNotificationStatus } from '../store/slices/authSlice';
import { selectAuthLoader, selectNotifications, selectNotificationsReversed, selectUser } from '../store/selector';

export default function NotificationScreen() {
    const navigation = useNavigation();
      const loading = useSelector(selectAuthLoader);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const notifications = useSelector(selectNotifications);

 console.log('notifications in screen', notifications);
  const formatTime = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const onRefresh = () => {
    // if (user?.id) {
    //   dispatch(fetchNotifications(user.id));
    // }
  };



  const handleCardPress = (item) => {
    if (item.status === 'UNREAD') {
      dispatch(updateNotificationStatus({ id: item.id, status: 'read' }));
    }
  };

  const handleDelete = id => {
    dispatch(removeNotification({ id }));
  };
  //Colors.darkBlue
  //Colors.primary
  //Colors.secondary
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.card, { 
        borderLeftColor: item.status === 'UNREAD' ? Colors.primary : Colors.grayColor 
      }]}
      onPress={() => handleCardPress(item)}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.desc}>{item.message}</Text>
        <Text style={styles.time}>{formatTime(item.createdAt)}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <Text style={styles.delete}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={{flex:1}}>
        <CommonAppBar label={"Notifications"} navigation={navigation} />
    <FlatList
      data={notifications}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginVertical:4,
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  desc: {
    fontSize: 12,
    color: '#555',
  },
  time: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
  delete: {
    fontSize: 18,
    color: Colors.grayColor,
    marginLeft: 10,
  },
});
