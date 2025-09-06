import { StyleSheet, View, FlatList } from 'react-native';
import React from 'react';
import SwipableTabs from '../../components/SwipableTabs';
import { CommonAppBar, FaddedIcon } from '../../components/commonComponents';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../styles/commonStyles';
import PickupRequestCard from '../../components/driverComponents/PickupRequestCard';
import { bookings } from '../../utils/dummyData';

const ClosedPickups = () => (
  <FlatList
    data={bookings}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => <PickupRequestCard booking={item} />}
    ListFooterComponent={<FaddedIcon />}
  />
);

const OngoingPickups = () => (
  <FlatList
    data={bookings}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => <PickupRequestCard booking={item} />}
    ListFooterComponent={<FaddedIcon />}
  />
);

const PickupRequests = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <CommonAppBar navigation={navigation} label={'Pickup Orders'} />
      <SwipableTabs
        titles={['Ongoing Pickups', 'Closed Pickups']}
        components={[<OngoingPickups />, <ClosedPickups />]}
      />
    </View>
  );
};

export default PickupRequests;

const styles = StyleSheet.create({});
