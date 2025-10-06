import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import SwipableTabs from '../../components/SwipableTabs';
import {
  CommonAppBar,
  EmptyList,
  FaddedIcon,
} from '../../components/commonComponents';
import BookingCard from '../../components/userComponents/BookingCard';
import { selectOrders } from '../../store/selector';
import { Colors } from '../../styles/commonStyles';
import { LoaderCard } from '../../components/LoaderCard';
import { RefreshControl } from 'react-native-gesture-handler';
import { fetchOrders } from '../../store/thunks/userThunk';
const ClosedBookings = ({
  orders,
  isLoading,
  completedFilter,
  setCompletedFilter,
  onRefresh,
  refreshing,
}) => {
  const completedFilters = ['all', 'completed', 'cancelled'];

  const getCompletedOrders = () => {
    const baseOrders =
      orders?.filter(
        order =>
          order?.status === 'COMPLETED' ||
          order?.status === 'CANCELLED_BY_USER' ||
          order?.status === 'CANCELLED_BY_ADMIN' ||
          order?.status === 'CANCELLED_BY_DRIVER' ||
          order?.status.includes('CANCELLED'),
      ) || [];

    if (completedFilter === 'all') return baseOrders;
    if (completedFilter === 'completed')
      return baseOrders.filter(order => order?.status === 'COMPLETED');
    if (completedFilter === 'cancelled')
      return baseOrders.filter(
        order =>
          order?.status === 'CANCELLED_BY_USER' ||
          order?.status === 'CANCELLED_BY_ADMIN' ||
          order?.status === 'CANCELLED_BY_DRIVER' ||
          order?.status.includes('CANCELLED'),
      );
    return baseOrders;
  };

  const completedOrders = getCompletedOrders();

  return (
    <>
      {isLoading ? (
        <LoaderCard count={5} cardHeight={12} />
      ) : (
        <View style={{ flex: 1 }}>
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
            style={{ flex: 1 }}
            data={completedOrders}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => <BookingCard booking={item} />}
            ListFooterComponent={
              <>{completedOrders.length >= 2 && <FaddedIcon />}</>
            }
            ListEmptyComponent={
              <EmptyList message={"You Don't have any completed Order yet"} />
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
      )}
    </>
  );
};

const OngoingBookings = ({
  orders,
  isLoading,
  ongoingFilter,
  setOngoingFilter,
  onRefresh,
  refreshing,
}) => {
  const ongoingFilters = ['all', 'active', 'incomplete', 'out for pickup'];

  const getOngoingOrders = () => {
    const baseOrders =
      orders?.filter(
        order =>
          order?.status === 'ACTIVE' ||
          order?.status === 'INCOMPLETE' ||
          order?.status === 'NEW' ||
          order?.status === 'OUT_FOR_PICKUP',
      ) || [];

    if (ongoingFilter === 'all') return baseOrders;
    if (ongoingFilter === 'active')
      return baseOrders.filter(order => order?.status === 'ACTIVE');
    if (ongoingFilter === 'incomplete')
      return baseOrders.filter(order => order?.status === 'INCOMPLETE');
    if (ongoingFilter === 'out for pickup')
      return baseOrders.filter(order => order?.status === 'OUT_FOR_PICKUP');
    return baseOrders;
  };

  const ongoingOrders = getOngoingOrders();

  return (
    <>
      {isLoading ? (
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
            renderItem={({ item }) => <BookingCard booking={item} />}
            ListFooterComponent={
              <>{ongoingOrders.length >= 2 && <FaddedIcon />}</>
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <EmptyList message={"You Don't have any Ongoing Order yet"} />
            }
          />
        </View>
      )}
    </>
  );
};

const BookingScreen = () => {
  // console.log("Rendering BookingScreen");
  const [isLoading, setIsLoading] = useState(false);
  const [ongoingFilter, setOngoingFilter] = useState('all');
  const [completedFilter, setCompletedFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  // console.log("orders in booking screen", orders);
  
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchOrders());
    } catch (error) {
      console.log('Error refreshing orders:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <CommonAppBar navigation={navigation} label={'Bookings'} />
      <SwipableTabs
        titles={['Ongoing Bookings', 'Closed Bookings']}
        components={[
          <OngoingBookings
            orders={orders}
            isLoading={isLoading}
            ongoingFilter={ongoingFilter}
            setOngoingFilter={setOngoingFilter}
            onRefresh={onRefresh}
            refreshing={refreshing}
          />,
          <ClosedBookings
            orders={orders}
            isLoading={isLoading}
            completedFilter={completedFilter}
            setCompletedFilter={setCompletedFilter}
            onRefresh={onRefresh}
            refreshing={refreshing}
          />,
        ]}
      />
    </View>
  );
};

export default BookingScreen;

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
