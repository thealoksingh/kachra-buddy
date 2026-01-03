
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from "react-native";
import {
  Colors,
  Sizes,
  Fonts,
} from "../styles/commonStyles";
import MyStatusBar from "../components/MyStatusBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { TicketCard } from "../components/TicketCard";
import { CommonAppBar } from "../components/commonComponents";
import { useNavigation } from "@react-navigation/native";
import { LoaderCard } from "../components/LoaderCard";
import { getAllSupportTickets } from "../store/thunks/authThunk";
import { useDispatch, useSelector } from 'react-redux';
import { selectSupportTickets, selectUser, selectAuthLoader } from '../store/selector';


const RaisedTickets = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const user = useSelector(selectUser);
  const supportTickets = useSelector(selectSupportTickets);
  const isLoading = useSelector(selectAuthLoader);

  useEffect(() => {
    if (user?.id) {
      dispatch(getAllSupportTickets(user.id));
    }
  }, [dispatch, user?.id]);

  const onRefresh = () => {
    if (user?.id) {
      setRefreshing(true);
      dispatch(getAllSupportTickets(user.id)).finally(() => setRefreshing(false));
    }
  };

  return (
    <View style={styles.container}>
      <MyStatusBar />
      <CommonAppBar label={"Raised Tickets" } navigation={navigation}/>
     
       {isLoading ? (
        <LoaderCard count={5} cardHeight={12}/>
      ):( <FlatList
        data={supportTickets.reverse()}
        renderItem={({ item }) => <TicketCard ticket={item} />}
        keyExtractor={(item) => item?.id?.toString()}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="confirmation-number" size={60} color={Colors.extraLightGrayColor} />
            <Text style={styles.emptyText}>No Support Tickets found</Text>
            
          </View>
        }
      />)}
    </View>
  );



};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: Sizes.fixPadding * 0.5,
  },

  listContainer: {
    paddingBottom: 16,
    flexGrow:1,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.grayColor,
    marginTop: 12,
  },
});

export default RaisedTickets;