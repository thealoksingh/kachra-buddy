import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import SwipableTabs from '../../components/SwipableTabs';
import { CommonAppBar, FaddedIcon } from '../../components/commonComponents';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../styles/commonStyles';
import PickupRequestCard from '../../components/driverComponents/PickupRequestCard';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllOrders, selectDriverOrders, selectUser } from '../../store/selector';
import { fetchDriverOrders, getAllOrders } from '../../store/thunks/driverThunk';

const ClosedPickups = ({ orders, onRefresh, refreshing }) => {
  console.log("ClosedPickups - orders:", orders);
  const closedOrders = Array.isArray(orders) ? orders?.filter(order => 
    order?.status !== 'ACTIVE' && order?.status !== 'OUT_FOR_PICKUP'
  ) : [];
  console.log("ClosedPickups - filtered orders:", closedOrders);
  return (
    <FlatList
      data={closedOrders}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <PickupRequestCard booking={item} />}
      ListFooterComponent={<FaddedIcon />}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    />
  );
};

const OngoingPickups = ({ orders, onRefresh, refreshing }) => {
  console.log("OngoingPickups - orders:", orders);
  const ongoingOrders = Array.isArray(orders) ? orders.filter(order => 
    order?.status === 'ACTIVE' || order?.status === 'OUT_FOR_PICKUP'
  ) : [];
  console.log("OngoingPickups - filtered orders:", ongoingOrders);
  return (
    <FlatList
      data={ongoingOrders}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <PickupRequestCard booking={item} />}
      ListFooterComponent={<FaddedIcon />}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    />
  );
};

const PickupRequests = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const orders = useSelector(selectDriverOrders) || [];
  const [refreshing, setRefreshing] = useState(false);
  
  console.log("Orders from selector:", orders);
  console.log("Orders length:", orders?.length);
  
  const onRefresh = async () => {
    setRefreshing(true);
    console.log("Refreshing orders...");
    await dispatch(getAllOrders());
    setRefreshing(false);
  };
  
  // Fetch all orders when component mounts and user is present
  useEffect(() => {
    if (user) {
      console.log("Dispatching getAllOrders for user:", user?.id);
      dispatch(getAllOrders());
    }
  }, [user, dispatch]);
  
  // Log orders when they change
  useEffect(() => {
    console.log("Orders updated:", orders);
  }, [orders]);



  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <CommonAppBar navigation={navigation} label={'Pickup Orders'} />
      <SwipableTabs
        titles={['Ongoing Pickups', 'Closed Pickups']}
        components={[
          <OngoingPickups orders={orders} onRefresh={onRefresh} refreshing={refreshing} />, 
          <ClosedPickups orders={orders} onRefresh={onRefresh} refreshing={refreshing} />
        ]}
      />
    </View>
  );
};

export default PickupRequests;

const styles = StyleSheet.create({});
