import {
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SwipableTabs from '../../components/SwipableTabs';
import { CommonAppBar, FaddedIcon } from '../../components/commonComponents';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../styles/commonStyles';
import BookingCardAdmin from '../../components/adminComponents/BookingCardAdmin';
import { fetchAllOrders } from '../../store/thunks/adminThunk';
import { selectAdminOrders } from '../../store/selector';
import { LoaderCard } from '../../components/LoaderCard';

const AllBookingsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [ongoingFilter, setOngoingFilter] = useState('all');
  const [completedFilter, setCompletedFilter] = useState('all');
  const orders = useSelector(selectAdminOrders);
  const [refreshing, setRefreshing] = useState(false);

  const ongoingFilters = ['all', 'active', 'new', 'out for pickup'];
  const completedFilters = ['all', 'completed', 'cancelled'];
  console.log('orders in all bookings screen', orders);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const onRefresh = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    setRefreshing(true);
    await dispatch(fetchAllOrders());
    setRefreshing(false);
  };

  const getOngoingOrders = () => {
    const baseOrders = orders.filter(
      order =>
        order.status === 'ACTIVE' ||
        order.status === 'INCOMPLETE' ||
        order.status === 'NEW' ||
        order.status === 'OUT_FOR_PICKUP',
    );

    if (ongoingFilter === 'all') return baseOrders;
    if (ongoingFilter === 'active')
      return baseOrders.filter(
        order => order.status === 'ACTIVE' || order.status === 'INCOMPLETE',
      );
    if (ongoingFilter === 'new')
      return baseOrders.filter(order => order.status === 'NEW');
    if (ongoingFilter === 'out for pickup')
      return baseOrders.filter(order => order.status === 'OUT_FOR_PICKUP');
    return baseOrders;
  };

  const getCompletedOrders = () => {
    const baseOrders = orders.filter(
      order =>
        order.status === 'COMPLETED' ||
        order.status === 'CANCELLED_BY_USER' ||
        order.status === 'CANCELLED_BY_ADMIN' ||
        order.status === 'CANCELLED_BY_DRIVER' ||
        order?.status.includes('CANCELLED'),
    );

    if (completedFilter === 'all') return baseOrders;
    if (completedFilter === 'completed')
      return baseOrders.filter(order => order.status === 'COMPLETED');
    if (completedFilter === 'cancelled')
      return baseOrders.filter(
        order =>
          order.status === 'CANCELLED_BY_USER' ||
          order.status === 'CANCELLED_BY_ADMIN' ||
          order.status === 'CANCELLED_BY_DRIVER' ||
          order?.status.includes('CANCELLED'),
      );
    // if (completedFilter === 'cancelled_by_user')
    //   return baseOrders.filter(order => order.status === 'CANCELLED_BY_USER');
    // if (completedFilter === 'cancelled_by_driver')
    //   return baseOrders.filter(order => order.status === 'CANCELLED_BY_DRIVER');
    // if (completedFilter === 'cancelled_by_admin')
    // return baseOrders.filter(order => order.status === 'CANCELLED_BY_ADMIN');
    return baseOrders;
  };

  const ongoingOrders = getOngoingOrders();
  const completedOrders = getCompletedOrders();

  const CompletedBookings = React.useMemo(
    () =>
      isLoading ? (
        <LoaderCard count={5} cardHeight={20} />
      ) : (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
          >
            {completedFilters.map(filter => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  completedFilter === filter && styles.selectedFilterButton,
                ]}
                onPress={() => setCompletedFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterText,
                    completedFilter === filter && styles.selectedFilterText,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <FlatList
            data={completedOrders}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => <BookingCardAdmin booking={item} />}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListFooterComponent={<FaddedIcon />}
          />
        </>
      ),
    [isLoading, completedOrders, refreshing],
  );

  const OngoingBookings = React.useMemo(
    () =>
      isLoading ? (
        <LoaderCard count={5} cardHeight={20} />
      ) : (
        <View style={{ flex: 1 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
          >
            {ongoingFilters.map(filter => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  ongoingFilter === filter && styles.selectedFilterButton,
                ]}
                onPress={() => setOngoingFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterText,
                    ongoingFilter === filter && styles.selectedFilterText,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <FlatList
            style={{ flex: 1 }}
            data={ongoingOrders}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => <BookingCardAdmin booking={item} />}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListFooterComponent={<FaddedIcon />}
          />
        </View>
      ),
    [isLoading, ongoingOrders, refreshing, ongoingFilter],
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <CommonAppBar navigation={navigation} label={'Bookings'} />
      <SwipableTabs
        titles={['Ongoing Bookings', 'Completed Bookings']}
        components={[OngoingBookings, CompletedBookings]}
      />
    </View>
  );
};

export default AllBookingsScreen;

const styles = StyleSheet.create({
  filterContainer: {
    marginVertical: 10,
    maxHeight: 40,
    paddingHorizontal: 10,
  },
  filterButton: {
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    minHeight: 30,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedFilterButton: {
    borderColor: Colors.primary,
    backgroundColor: '#f0f8ff',
  },
  filterText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
  selectedFilterText: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
