import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Colors } from '../styles/commonStyles';
import { CommonAppBar } from '../components/commonComponents';
import { useNavigation } from '@react-navigation/native';

export default function Notifications() {
    const navigation =useNavigation();
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Pickup Request',
      description: 'You have a New Pickup Request',
      time: '2m ago',
    },
    {
      id: '2',
      title: 'Pickup Succesfull',
      description: 'Congatulations You have picked u 40 orders',
      time: '10m ago',
    },
     {
      id: '3',
      title: 'Pickup Succesfull',
      description: 'Congatulations You have picked u 40 orders',
      time: '10m ago',
    },
     {
      id: '4',
      title: 'Pickup Succesfull',
      description: 'Congatulations You have picked u 40 orders',
      time: '10m ago',
    },
  ]);

  const handleDelete = id => {
    setNotifications(prev => prev.filter(item => item.id !== id));
  };
  //Colors.darkBlue
  //Colors.primary
  //Colors.secondary
  const renderItem = ({ item }) => (
    <View style={[styles.card, { borderLeftColor: Colors.primary }]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.desc}>{item.description}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <Text style={styles.delete}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{flex:1}}>
        <CommonAppBar label={"Notifications"} navigation={navigation} />
    <FlatList
      data={notifications}
      renderItem={renderItem}
      keyExtractor={item => item.id}
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
