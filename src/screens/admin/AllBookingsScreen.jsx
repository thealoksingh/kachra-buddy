import { StyleSheet, View, FlatList } from 'react-native';
import React from 'react';
import SwipableTabs from '../../components/SwipableTabs';
import { CommonAppBar, FaddedIcon } from '../../components/commonComponents';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../styles/commonStyles';
import BookingCardAdmin from '../../components/adminComponents/BookingCardAdmin';
import { bookings } from '../../utils/dummyData';

const PreviousBookings = () => (
  <FlatList
    data={bookings}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => <BookingCardAdmin booking={item} />}
    ListFooterComponent={<FaddedIcon />}
  />
);

const OngoingBookings = () => (
  <FlatList
    data={bookings}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => <BookingCardAdmin booking={item} />}
    ListFooterComponent={<FaddedIcon />}
  />
);

const AllBookingsScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <CommonAppBar navigation={navigation} label={'Bookings'} />
      <SwipableTabs
        titles={['Ongoing Bookings', 'Previous Bookings']}
        components={[<OngoingBookings />, <PreviousBookings />]}
      />
    </View>
  );
};

export default AllBookingsScreen;

const styles = StyleSheet.create({});
