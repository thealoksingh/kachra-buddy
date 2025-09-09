// ViewAllUserPage.js
import React, { useEffect, useState } from 'react';
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
  ScrollView,
  StatusBar,
} from 'react-native';
import {
  Colors,
  screenWidth,
  commonStyles,
  Sizes,
  Fonts,
} from '../../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyStatusBar from '../../components/MyStatusBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { CommonAppBar } from '../../components/commonComponents';
import { useNavigation, useRoute } from '@react-navigation/native';

// Dummy users data for UI
const dummyUsers = [
  {
    id: 1,
    owner_legal_name: 'Alok singh',
    mobile_number: '+91 9687543210',
    status: 'Active',
    rating:2,
    role: 'user',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: 2,
    owner_legal_name: 'Ravi Kumar',
    mobile_number: '+91 9876543211',
    status: 'Blocked',
    rating:4,
    role: 'driver',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: 3,
    owner_legal_name: 'Gendu Singh',
    mobile_number: '+91 9896543212',
    status: 'Inactive',
    rating:5,
    role: 'user',
    avatar: null,
  },
];

const AllUsersScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { fromSelectUser, onUserSelect } = route.params || {};
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('both');
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  
 const filteredUsers = dummyUsers.filter((user) => {
  const matchesSearch =
    searchQuery === "" ||
    user?.owner_legal_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user?.mobile_number?.includes(searchQuery);

  const matchesRole =
    selectedRole === "both" || user?.role === selectedRole;

  const matchesStatus =
    selectedStatuses.length === 0 || selectedStatuses.includes(user?.status);

  const matchesFromSelect =
    fromSelectUser === "both" || !fromSelectUser || user?.role === fromSelectUser;

  return matchesSearch && matchesRole && matchesStatus && matchesFromSelect;
});


  const handleCardPress = (user) => {
  if (fromSelectUser && onUserSelect) {
    // Means we came here in "select mode"
    onUserSelect(user);
    navigation.goBack();
  } else {
    // Normal mode → open user update page
    navigation.navigate("updateUserScreen", { user });
  }
};

  return (
    <View style={styles.container}>
      <MyStatusBar />

      {searchBar()}

      <FlatList
        data={filteredUsers}
        renderItem={({ item }) => <UserInfo user={item} />}
        keyExtractor={item => item?.id?.toString()}
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

      {bottomSheet()}

      {!fromSelectUser && (
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.floatingButton}
          onPress={() => navigation.navigate('createUserScreen')}
        >
          <Text style={styles.floatingButtonText}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  function UserInfo({ user }) {
    return (
      <TouchableOpacity onPress={() => handleCardPress(user)} style={styles.userItem}>
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
          <Text style={styles.userName}>{user?.owner_legal_name || 'N/A'}</Text>
          <Text style={styles.userMobile}>{user?.mobile_number || 'N/A'}</Text>
          <Text style={[styles.userMobile, { color: Colors.blackColor }]}>
            Status:{' '}
            <Text
              style={{
                color:
                  user?.status === 'Active'
                    ? Colors.primary
                    : user?.status === 'Blocked'
                    ? Colors.redColor
                    : Colors.secondary,
              }}
            >
              {user?.status || 'N/A'}
            </Text>
          </Text>
        </View>

        <View style={[styles.roleBadge,{borderColor:user?.role==='user'?Colors.primary:Colors.secondaryLight}]}>
          <Text
            style={[
              styles.roleText,
              {
                color:
                  user?.role === 'user' ? Colors.primary :Colors.secondaryLight,
              },
            ]}
          >
            {user?.role || 'N/A'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  function bottomSheet() {
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
                <MaterialIcons
                  name="close"
                  size={24}
                  color={Colors.blackColor}
                />
              </TouchableOpacity>
            </View>

            {roleFilter()}
            {statusFilter()}
          </View>
        </View>
      </Modal>
    );
  }

  function roleFilter() {
    const roles = ['both', 'user', 'driver'];

    return (
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          {roles.map(role => (
            <TouchableOpacity
              key={role}
              style={[
                styles.filterChip,
                selectedRole === role && styles.selectedChip,
              ]}
              onPress={() => setSelectedRole(role)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedRole === role && styles.selectedChipText,
                ]}
              >
                {role === 'both'
                  ? 'All'
                  : role.charAt(0).toUpperCase() + role.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  function statusFilter() {
    const allStatuses = [
      'Active',
      'Inactive',
      'Blocked',
      'New',
      'Completed',
      'Rejected',
    ];

    const toggleStatus = status => {
      if (selectedStatuses.includes(status)) {
        setSelectedStatuses(selectedStatuses.filter(s => s !== status));
      } else {
        setSelectedStatuses([...selectedStatuses, status]);
      }
    };

    return (
      <View style={styles.filterSection}>
        <View style={styles.statusHeader}>
   
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          {allStatuses.map(status => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterChip,
                selectedStatuses.includes(status) && styles.selectedChip,
              ]}
              onPress={() => toggleStatus(status)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedStatuses.includes(status) && styles.selectedChipText,
                ]}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  function searchBar() {
    return (
      <View
        style={{
          margin: 20,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
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
            onChangeText={text => setSearchQuery(text)}
          />
        </View>

        {!fromSelectUser&&(<TouchableOpacity
          style={styles.filterIcon}
          onPress={() => setBottomSheetVisible(true)}
        >
          <MaterialIcons
            name="filter-list"
            size={24}
            color={Colors.blackColor}
          />
          <View style={styles.filterBadge}>
            <Text style={styles.filterBadgeText}>{filteredUsers.length}</Text>
          </View>
        </TouchableOpacity>)}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.bodyBackColor,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: "rgba(182, 206, 232, 0.3)",
    zIndex: 999,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.whiteColor,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    elevation: 2,
    shadowColor: '#000',
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
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: 'bold',
    color: Colors.blackColor,
    marginBottom: 4,
  },
  userMobile: {
    fontSize: 12,
    color: Colors.grayColor,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:14,
    borderWidth:1,
    backgroundColor: Colors.extraLightGrayColor,
  },
  roleText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: Colors.extraLightGrayColor,
    marginLeft: 78, // Aligns with the end of the avatar
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.extraLightGrayColor,
    marginTop: 12,
  },
  bottomSheet: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  TypeContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  TypeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
  },
  TypebuttonText: {
    fontSize: 12,
    color: '#555',
  },
  selectedButton: {
    backgroundColor: Colors.primaryColor,
    borderColor: Colors.primaryColor,
  },
  selectedButtonText: {
    color: 'white',
  },
  filterIcon: {
    position: 'relative',
    marginLeft: 12,
    padding: 8,
  },
  filterBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: Colors.whiteColor,
    fontSize: 10,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    marginLeft: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.blackColor,
  },
  filterSection: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.blackColor,
    marginBottom: 10,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  clearText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterChip: {
    backgroundColor: Colors.extraLightGrayColor,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.grayColor,
  },
  selectedChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: Colors.blackColor,
    fontWeight: '500',
  },
  selectedChipText: {
    color: Colors.whiteColor,
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 100,
    right: 40,
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Colors.whiteColor,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  floatingButtonText: {
    fontSize: 24,
    color: Colors.whiteColor,
    fontWeight: 'bold',
  },
});

export default AllUsersScreen;
