import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Animated,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '../styles/commonStyles';
import { CommonAppBar } from '../components/commonComponents';
import { useNavigation } from '@react-navigation/native';
import {
  removeNotification,
  updateNotificationStatus,
} from '../store/slices/authSlice';
import {
  selectAuthLoader,
  selectNotifications,
  selectUser,
} from '../store/selector';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';

export default function NotificationScreen() {
  const navigation = useNavigation();
  const loading = useSelector(selectAuthLoader);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const notifications = useSelector(selectNotifications);

  const formatTime = createdAt => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const onRefresh = () => {
    // refresh API if needed
  };

  const handleCardPress = item => {
    if (item.status === 'UNREAD') {
      dispatch(updateNotificationStatus({ id: item.id, status: 'read' }));
    }
  };

  const handleDelete = id => {
    dispatch(removeNotification({ id }));
  };

  const renderItem = ({ item }) => {
    // Animation value for swiping
    const translateX = new Animated.Value(0);

    // Define swipe gesture
    const swipeGesture = Gesture.Pan()
      .onUpdate(e => {
        if (e.translationX < 0) {
          translateX.setValue(e.translationX);
        }
      })
      .onEnd(e => {
        if (e.translationX < -80) {
          handleDelete(item.id);
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      });

    return (
      <GestureDetector gesture={swipeGesture}>
        <Animated.View
          style={[
            styles.swipeableContainer,
            { transform: [{ translateX }] },
          ]}
        >
          <View
            style={[
              styles.card,
              {
                borderLeftColor:
                  item.status === 'UNREAD'
                    ? Colors.primary
                    : Colors.grayColor,
              },
            ]}
            onTouchEnd={() => handleCardPress(item)}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.desc}>{item.message}</Text>
              <Text style={styles.time}>{formatTime(item.createdAt)}</Text>
            </View>
          </View>
          {/* <View style={styles.deleteBox}>
            <Text style={styles.deleteText}>Delete</Text>
          </View> */}
        </Animated.View>
      </GestureDetector>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <CommonAppBar label={'Notifications'} navigation={navigation} />
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  swipeableContainer: {
    marginHorizontal: 10,
    marginVertical: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
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
  deleteBox: {
    position: 'absolute',
    right: -100,
    top: 0,
    bottom: 0,
    width: 80,
    backgroundColor: Colors.redColor || 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
  },
});
