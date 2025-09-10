import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SwipableTabs from '../../components/SwipableTabs';
import { CommonAppBar, FaddedIcon } from '../../components/commonComponents';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../styles/commonStyles';
import BookingCardAdmin from '../../components/adminComponents/BookingCardAdmin';
import { fetchAllOrders } from '../../store/thunks/adminThunk';
import { selectAdminOrders } from '../../store/selector';

const AllBookingsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const orders = useSelector(selectAdminOrders);
  const [refreshing, setRefreshing] = useState(false);
  console.log("orders in all bookings screen", orders);
  
  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchAllOrders());
    setRefreshing(false);
  };
  
  const ongoingOrders = orders.filter(order => 
    order.status === 'ACTIVE' || order.status === 'NEW' || order.status === 'OUT_FOR_PICKUP'
  );
  
  const previousOrders = orders.filter(order => 
    order.status === 'COMPLETED' || order.status === 'CANCELLED'
  );
  
  const PreviousBookings = () => (
    <FlatList
      data={previousOrders}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <BookingCardAdmin booking={item} />}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListFooterComponent={<FaddedIcon />}
    />
  );

  const OngoingBookings = () => (
    <FlatList
      data={ongoingOrders}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <BookingCardAdmin booking={item} />}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListFooterComponent={<FaddedIcon />}
    />
  );

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
