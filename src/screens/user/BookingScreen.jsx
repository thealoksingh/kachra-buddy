import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import SwipableTabs from '../../components/SwipableTabs';
import { CommonAppBar, EmptyList, FaddedIcon } from '../../components/commonComponents';
import BookingCard from '../../components/userComponents/BookingCard';
import { selectOrders } from '../../store/selector';
import { Colors } from '../../styles/commonStyles';
import { LoaderCard } from '../../components/LoaderCard';
const ClosedBookings = ({ orders, isLoading }) => {
  const completedOrders = orders?.filter(order => order?.status === 'COMPLETED'||order?.status.includes('CANCELLED'));
  return (
    <>
      {isLoading ? (
        <LoaderCard count={5} cardHeight={12} />
      ) : (
        <FlatList
          data={completedOrders}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => <BookingCard booking={item} />}
          ListFooterComponent={
            <>{completedOrders.length >=2 && <FaddedIcon />}</>
          }
           ListEmptyComponent={
            <EmptyList message={"You Don't have any completed Order yet"} />
          }
        />
      )}
    </>
  );
};

const OngoingBookings = ({ orders, isLoading }) => {
  const ongoingOrders = orders?.filter(
    order => order?.status === 'ACTIVE' || order?.status === 'INCOMPLETE',
  );

  return (
    <>
      {isLoading ? (
        <LoaderCard count={5} cardHeight={20} />
      ) : (
        <FlatList
          data={ongoingOrders}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => <BookingCard booking={item} />}
          ListFooterComponent={
            <>{ongoingOrders.length >=2 && <FaddedIcon />}</>
          }
           ListEmptyComponent={
            <EmptyList message={"You Don't have any Ongoing Order yet"} />
          }
        />
      )}
    </>
  );
};

const BookingScreen = () => {
  // console.log("Rendering BookingScreen");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
  const navigation = useNavigation();
  const orders = useSelector(selectOrders);
  // console.log("orders in booking screen", orders);
  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <CommonAppBar navigation={navigation} label={'Bookings'} />
      <SwipableTabs
        titles={['Ongoing Bookings', 'Closed Bookings']}
        components={[
          <OngoingBookings orders={orders} isLoading={isLoading} />,
          <ClosedBookings orders={orders} isLoading={isLoading} />,
        ]}
      />
    </View>
  );
};

export default BookingScreen;

const styles = StyleSheet.create({});
