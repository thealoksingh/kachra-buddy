// ViewAllUserPage.js
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";
import {
  Colors,

  Sizes,
  Fonts,
} from "../styles/commonStyles";
import MyStatusBar from "../components/MyStatusBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { SupportTicket, TicketLoaderCard } from "../components/TicketCard";
import { CommonAppBar } from "../components/commonComponents";
import { useNavigation } from "@react-navigation/native";

const allIssues=[
{
    id: "1",
    title: "App not loading",
    status: "Open",
    created_at: "2024-08-25 10:30 AM",
    user: {
      avatar: null,
      owner_legal_name: "Rohit Sharma",
      mobile_number: "9876543210",
      role: "user",
    },
  },
  {
    id: "2",
    title: "App not loading",
    status: "Open",
    created_at: "2024-08-25 10:30 AM",
    user: {
      avatar: null,
      owner_legal_name: "Rohit Sharma",
      mobile_number: "9876543210",
      role: "user",
    },
  },

]



const RaisedTickets = () => {

      const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <View style={styles.container}>
      <MyStatusBar />
      <CommonAppBar label={"Raised Tickets" } navigation={navigation}/>
     
       {isLoading ? (
        <TicketLoaderCard count={5} />
      ):( <FlatList
        data={allIssues}
        renderItem={({ item }) => <SupportTicket issue={item} />}
        keyExtractor={(item) => item?.id?.toString()}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="confirmation-number" size={60} color={Colors.extraLightGrayColor} />
            <Text style={styles.emptyText}>No Issues found</Text>
            
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