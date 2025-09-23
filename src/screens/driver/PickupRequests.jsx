import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import SwipableTabs from '../../components/SwipableTabs';
import {
  CommonAppBar,
  EmptyList,
  FaddedIcon,
} from '../../components/commonComponents';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../styles/commonStyles';
import PickupRequestCard from '../../components/driverComponents/PickupRequestCard';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectAllOrders,
  selectDriverOrders,
  selectUser,
} from '../../store/selector';
import {
  fetchDriverOrders,
  getAllOrders,
  outForPickup,
} from '../../store/thunks/driverThunk';
import { showLottieAlert } from '../../store/slices/lottieAlertSlice';
import { WarningWithButton } from '../../components/lottie/WarningWithButton';
import { LoaderCard } from '../../components/LoaderCard';
import { DottedBlackLoader } from '../../components/lottie/loaderView';

const ClosedPickups = ({ orders, onRefresh, refreshing, isLoading }) => {
  console.log('ClosedPickups - orders:', orders);
  const closedOrders = Array.isArray(orders)
    ? orders?.filter(
        order =>
          order?.status !== 'ACTIVE' && order?.status !== 'OUT_FOR_PICKUP',
      )
    : [];
  console.log('ClosedPickups - filtered orders:', closedOrders);
  return (
    <>
      {isLoading ? (
        <LoaderCard count={5} cardHeight={12} />
      ) : (
        <FlatList
          data={closedOrders}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => <PickupRequestCard booking={item} />}
          ListFooterComponent={<>{closedOrders.length >=2 && <FaddedIcon />}</>}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <EmptyList message={"You Don't have any Closed Pickups yet"} />
          }
        />
      )}
    </>
  );
};

const OngoingPickups = ({
  orders,
  onRefresh,
  refreshing,
  setShowAlert,
  setBookingId,
  isLoading,
}) => {
  console.log('OngoingPickups - orders:', orders);

  const ongoingOrders = Array.isArray(orders)
    ? orders.filter(
        order =>
          order?.status === 'ACTIVE' || order?.status === 'OUT_FOR_PICKUP',
      )
    : [];
  console.log('OngoingPickups - filtered orders:', ongoingOrders);
  return (
    <>
      {isLoading ? (
        <LoaderCard count={5} cardHeight={12} />
      ) : (
        <FlatList
          data={ongoingOrders}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <PickupRequestCard
              booking={item}
              setShowAlert={setShowAlert}
              setBookingId={setBookingId}
            />
          )}
          ListFooterComponent={
            <>{ongoingOrders.length >=2 && <FaddedIcon />}</>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <EmptyList message={"You Don't have any Ongoing Pickups yet"} />
          }
        />
      )}
    </>
  );
};

const PickupRequests = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const orders = useSelector(selectDriverOrders) || [];
  const [refreshing, setRefreshing] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dottedLoaderVisible, setDottedLoaderVisible] = useState(false);

  // useEffect(() => {
  //   setIsLoading(true);
  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 500);
  // }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    console.log('Refreshing orders...');
    await dispatch(getAllOrders());
    setRefreshing(false);
  };

  // Fetch all orders when component mounts and user is present
  useEffect(() => {
    if (user) {
      console.log('Dispatching getAllOrders for user:', user?.id);
      dispatch(getAllOrders());
    }
  }, [user, dispatch]);

  const handleOutForPickup = async bookingId => {
    setDottedLoaderVisible(true);
    try {
      const result = await dispatch(outForPickup(bookingId));
      if (result.type.endsWith('/fulfilled')) {
        dispatch(
          showLottieAlert({
            type: 'success',
            message: 'Order marked as out for pickup successfully',
            autoClose: true,
          }),
        );
      } else {
        dispatch(
          showLottieAlert({
            type: 'failure',
            message: 'Failed to mark order as out for pickup',
            autoClose: true,
          }),
        );
      }
    } catch (error) {
      dispatch(
        showLottieAlert({
          type: 'failure',
          message: 'Failed to mark order as out for pickup',
          autoClose: true,
        }),
      );
    } finally {
      setDottedLoaderVisible(false);
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <CommonAppBar navigation={navigation} label={'Pickup Orders'} />
      <SwipableTabs
        titles={['Ongoing Pickups', 'Closed Pickups']}
        components={[
          <OngoingPickups
            orders={orders}
            onRefresh={onRefresh}
            refreshing={refreshing}
            setShowAlert={setShowAlert}
            setBookingId={setBookingId}
            isLoading={isLoading}
          />,
          <ClosedPickups
            orders={orders}
            onRefresh={onRefresh}
            refreshing={refreshing}
            isLoading={isLoading}
          />,
        ]}
      />
      {showAlert && (
        <WarningWithButton
          message="Are you sure you want to mark this order as Out for Pickup?"
          onYes={() => {
            handleOutForPickup(bookingId);
            setShowAlert(false);
          }}
          onClose={() => setShowAlert(false)}
        />
      )}
      {dottedLoaderVisible && <DottedBlackLoader />}
    </View>
  );
};

export default PickupRequests;

const styles = StyleSheet.create({});
