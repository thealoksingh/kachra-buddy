// ViewAllUserPage.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  StatusBar,
} from "react-native";
import {
  Colors,
  screenWidth,
  commonStyles,
  Sizes,
  Fonts,
} from "../../styles/commonStyles";
import { SafeAreaView } from 'react-native-safe-area-context';
import MyStatusBar from "../../components/MyStatusBar";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { CommonAppBar } from "../../components/commonComponents";
import { useNavigation } from "@react-navigation/native";

// Dummy users data for UI
const dummyUsers = [
  {
    id: 1,
    owner_legal_name: "John Doe",
    mobile_number: "+91 9876543210",
    status: "Active",
    role: "user",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 2,
    owner_legal_name: "Jane Smith",
    mobile_number: "+91 9876543211",
    status: "Blocked",
    role: "driver",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 3,
    owner_legal_name: "Mike Johnson",
    mobile_number: "+91 9876543212",
    status: "Inactive",
    role: "user",
    avatar: null
  }
];


const AllUsersScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState("both");
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const filteredUsers = dummyUsers.filter((user) => {
    const matchesSearch = searchQuery === "" || 
      user?.owner_legal_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.mobile_number?.includes(searchQuery);

    const matchesRole = selectedRole === "both" || user?.role === selectedRole;

    const matchesStatus =
      selectedStatuses.length === 0 || selectedStatuses.includes(user?.status);

    return matchesSearch && matchesRole && matchesStatus;
  });




  return (
    <View style={styles.container}>
      <MyStatusBar />
         
      {searchBar()}

      <FlatList
        data={filteredUsers}
        renderItem={({ item }) => <UserInfo user={item} />}
        keyExtractor={(item) => item?.id?.toString()}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="account-search" size={60} color={Colors.grayColor} />
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        }
      />
      
      {bottonSheet()}
    </View>
  );

  function UserInfo({ user }) {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("userDetailScreen", { user })}
        style={styles.userItem}
      >
        {user?.avatar ? (
          <Image source={{ uri: user?.avatar }} style={styles.avatar} />
        ) : (
          <Icon
            name="account-circle"
            size={50}
            color={Colors.grayColor}
            style={styles.avatar}
          />
        )}

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.owner_legal_name || "N/A"}</Text>
          <Text style={styles.userMobile}>{user?.mobile_number || "N/A"}</Text>
          <Text style={[styles.userMobile,{color: Colors.blackColor}]}>
            Status:{" "}
            <Text
              style={{
                color:
                  user?.status === "Active"
                    ? Colors.primary
                    : user?.status === "Blocked"
                    ? Colors.redColor
                    : Colors.secondary, 
              }}
             >
              {user?.status || "N/A"}
            </Text>
          </Text>
        </View>

        <View style={[styles.roleBadge]}>
          <Text
            style={[
              styles.roleText,
              { color: user?.role === "user" ? Colors.primary : Colors.secondary },
            ]}
          >
            {user?.role || "N/A"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  function searchBar() {
    return (
      <View
        style={{
          margin: 20,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <MyStatusBar />

        {/* Wrap SearchBar and give it flex: 1 */}
        <View style={[styles.searchBar, { flex: 1 }]}>
          <MaterialIcons
            name="search"
            size={24}
            color="#888"
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Search Users or Drivers...."
            placeholderTextColor="#888"
            style={{
              flex: 1,
              padding: 12,
              fontSize: 12,
            }}
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>

        {/* Filter Icon */}
           <View style={{ position: "relative", marginLeft: 12 }}>
          <MaterialIcons
            name="filter-list"
            color={Colors.blackColor}
            size={26}
            onPress={() => setBottomSheetVisible(true)}
          />
          <View
            style={{
              position: "absolute",
              top: -8,
              right: -8,
              backgroundColor: "red",
              borderRadius: 10,
              width: 18,
              height: 18,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 10, fontWeight: "bold" }}>
           {filteredUsers.length}
            </Text>
          </View>
        </View>
      </View>
    );
  }
  function bottonSheet() {
    return (
      <Modal
        visible={isBottomSheetVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setBottomSheetVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Options</Text>
              <TouchableOpacity onPress={() => setBottomSheetVisible(false)}>
                <MaterialIcons name="close" size={24} color={Colors.blackColor} />
              </TouchableOpacity>
            </View>
            {roleSelector()}
            {statusSection()}
          </View>
        </View>
      </Modal>
    );
  }

  function roleSelector() {
    const roles = ["user", "driver", "both"];

    return (
      <View style={[styles.section, { marginBottom: 12 }]}>
        <Text style={{ marginBottom: 4, fontWeight: "bold", fontSize: 14 }}>
          Select Role
        </Text>

        <View style={styles.TypeContainer}>
          {roles.map((role) => (
            <TouchableOpacity
              key={role}
              style={[
                styles.TypeButton,
                selectedRole === role && styles.selectedButton,
              ]}
              onPress={() => setSelectedRole(role)}
            >
              <Text
                style={[
                  styles.TypebuttonText,
                  selectedRole === role && styles.selectedButtonText,
                ]}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  function statusSection() {
    // const statuses = ["New", "Active", "Inactive", "Blocked"];
    const driverStatuses = ["New", "Completed", 'Rejected', "Active", "Inactive", "Blocked"];
    const userStatuses = ["Active", "Inactive", "Blocked"];
   

    const toggleStatus = (status) => {
      if (selectedStatuses.includes(status)) {
        setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
      } else {
        setSelectedStatuses([...selectedStatuses, status]);
      }
    };

    return (
      <View style={[styles.section, { marginBottom: 12 }]}>
        <Text style={{ marginBottom: 4, fontWeight: "bold", fontSize: 14 }}>
          Select Status
        </Text>

        <View style={[styles.TypeContainer, { flexWrap: "wrap" }]}>
          {selectedRole==="user" && userStatuses.map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.TypeButton,
                selectedStatuses.includes(status) && styles.selectedButton,
              ]}
              onPress={() => toggleStatus(status)}
            >
              <Text
                style={[
                  styles.TypebuttonText,
                  selectedStatuses.includes(status) &&
                    styles.selectedButtonText,
                ]}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
          {(selectedRole==="driver" ||  selectedRole === 'both') && driverStatuses.map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.TypeButton,
                selectedStatuses.includes(status) && styles.selectedButton,
              ]}
              onPress={() => toggleStatus(status)}
            >
              <Text
                style={[
                  styles.TypebuttonText,
                  selectedStatuses.includes(status) &&
                    styles.selectedButtonText,
                ]}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
          
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: Colors.bodyBackColor,
    paddingHorizontal: Sizes.fixPadding * 0.5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.bodyBackColor,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "rgba(182, 206, 232, 0.3)",
    zIndex: 999,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.whiteColor,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: Colors.grayColor,
  },
  listContainer: {
    paddingBottom: 16,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 3,
    ...commonStyles.shadow,
    borderColor: Colors.extraLightGrayColor,
    borderWidth: 0.1,
    borderTopWidth: 1.0,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.blackColor,
    marginBottom: 4,
  },
  userMobile: {
    fontSize: 12,
    color: Colors.grayColor,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  roleText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: Colors.extraLightGrayColor,
    marginLeft: 78, // Aligns with the end of the avatar
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    color:Colors.extraLightGrayColor,
    marginTop: 12,
  },
  bottomSheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  TypeContainer: {
    flexDirection: "row",
    gap: 10,
  },
  TypeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
  },
  TypebuttonText: {
    fontSize: 12,
    color: "#555",
  },
  selectedButton: {
    backgroundColor: Colors.primaryColor,
    borderColor: Colors.primaryColor,
  },
  selectedButtonText: {
    color: "white",
  },
});



export default AllUsersScreen;