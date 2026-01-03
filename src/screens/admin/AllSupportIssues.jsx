import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Colors } from '../../styles/commonStyles';
import MyStatusBar from '../../components/MyStatusBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { FaddedIcon } from '../../components/commonComponents';
import { fetchAllTickets } from '../../store/thunks/adminThunk';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllTickets } from '../../store/selector';
import { LoaderCard } from '../../components/LoaderCard';


const AllSupportIssues = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const allTickets = useSelector(selectAllTickets);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('both');
  const [selectedTicketStatuses, setSelectedTicketStatuses] = useState([]);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  console.log('allTickets at admin', allTickets);
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    dispatch(fetchAllTickets());
  }, [dispatch]);

  const filteredTickets = allTickets.filter(ticket => {
    const matchesSearch =
      searchQuery === '' ||
      ticket?.userName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      ticket?.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket?.userContact?.includes(searchQuery);

    const matchesRole =
      selectedRole === 'both' || ticket?.type?.toLowerCase() === selectedRole;

    const matchesTicketStatus =
      selectedTicketStatuses.length === 0 ||
      selectedTicketStatuses.includes(ticket?.status);

    return matchesSearch && matchesRole && matchesTicketStatus;
  });

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(fetchAllTickets()).finally(() => setRefreshing(false));
  };

  const handleCardPress = ticket => {
    navigation.navigate('supportIssueDetail', { ticket });
  };

function TicketCard({ ticket }) {
   
   
    const getStatusColor = status => {
      switch (status?.toUpperCase()) {
        case 'OPEN':
          return '#FF6B6B';
        case 'IN_PROGRESS':
          return '#4ECDC4';
        case 'RESOLVED':
          return '#45B7D1';
        case 'CLOSED':
          return '#96CEB4';
        case 'CANCELLED':
          return '#FF4757';
        default:
          return Colors.grayColor;
      }
    };

    const getPriorityColor = priority => {
      switch (priority?.toUpperCase()) {
        case 'HIGH':
        case 'URGENT':
          return '#FF4757';
        case 'MEDIUM':
          return '#FFA726';
        case 'LOW':
          return '#66BB6A';
        default:
          return Colors.grayColor;
      }
    };

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleCardPress(ticket)}
        style={[styles.ticketCard,{borderLeftColor:getPriorityColor(ticket?.priority)}]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.userSection}>
            {ticket?.avatar ? (
              <Image source={{ uri: ticket?.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Icon name="account" size={24} color={Colors.grayColor} />
              </View>
            )}
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{ticket?.userName}</Text>
              <Text style={styles.userMobile}>{ticket?.userContact}</Text>
            </View>
          </View>

          <View style={styles.badgeContainer}>
            <View
              style={[
                styles.roleBadge,
                {
                  borderColor: ticket?.type === 'TECHNICAL' ? '#1976D2' : '#F57C00',
                  backgroundColor: ticket?.type === 'TECHNICAL' ? '#E3F2FD' : '#FFF3E0',
                },
              ]}
            >
              <Text
                style={[
                  styles.roleText,
                  {
                    color: ticket?.type === 'TECHNICAL' ? '#1976D2' : '#F57C00',
                  },
                ]}
              >
                {ticket?.type||"TICKET TYPE"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.ticketContent}>
          <Text style={styles.ticketTitle} numberOfLines={1}>
            {ticket?.subject}
          </Text>
          <Text style={styles.ticketDescription} numberOfLines={2}>
            {ticket?.description}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.statusSection}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: getStatusColor(ticket?.status) + '20',
                  borderColor: getStatusColor(ticket?.status),
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color: getStatusColor(ticket?.status),
                  },
                ]}
              >
                {ticket?.status||"STATUS"}
              </Text>
            </View>

            <View
              style={[
                styles.priorityBadge,
                {
                  backgroundColor: getPriorityColor(ticket?.priority) + '20',
                  borderColor: getPriorityColor(ticket?.priority),
                },
              ]}
            >
              <Text
                style={[
                  styles.priorityText,
                  {
                    color: getPriorityColor(ticket?.priority),
                  },
                ]}
              >
                {ticket?.priority||"PRIORITY"}
              </Text>
            </View>
          </View>

          <View style={styles.dateSection}>
            <Text style={styles.dateText}>
              Created: {ticket?.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'N/A'}
            </Text>
            {ticket?.updatedAt && ticket?.updatedAt !== ticket?.createdAt && (
              <Text style={styles.dateText}>
                Updated: {new Date(ticket.updatedAt).toLocaleDateString()}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  function roleFilter() {
    const roles = ['both', 'technical', 'general'];

    return (
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>User Role</Text>
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

  function ticketStatusFilter() {
    const ticketStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELLED'];

    const toggleTicketStatus = status => {
      if (selectedTicketStatuses.includes(status)) {
        setSelectedTicketStatuses(
          selectedTicketStatuses.filter(s => s !== status),
        );
      } else {
        setSelectedTicketStatuses([...selectedTicketStatuses, status]);
      }
    };

    return (
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Ticket Status</Text>
         <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          {ticketStatuses.map(status => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterChip,
                selectedTicketStatuses.includes(status) && styles.selectedChip,
              ]}
              onPress={() => toggleTicketStatus(status)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedTicketStatuses.includes(status) &&
                    styles.selectedChipText,
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
            {ticketStatusFilter()}
          </View>
        </View>
      </Modal>
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
            placeholder="Search tickets, users..."
            placeholderTextColor="#888"
            style={{
              flex: 1,
              padding: 12,
              fontSize: 12,
            }}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setBottomSheetVisible(true)}
        >
          <MaterialIcons name="filter-list" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MyStatusBar />

      {searchBar()}

        {isLoading ? (
        <LoaderCard count={5} cardHeight={20} />
        ) : (<FlatList
        data={filteredTickets.reverse()}
        renderItem={({ item }) => <TicketCard ticket={item} />}
        keyExtractor={item => item?.id?.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
             
             <FaddedIcon/>
             <Text style={styles.emptyText}>No Support Tickets Found</Text>
          </View>
        }
      />)}

      {bottomSheet()}
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.whiteColor,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterButton: {
    marginLeft: 12,
    padding: 10,
    backgroundColor: Colors.whiteColor,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  ticketCard: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 16,
    padding: 16,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#4ECDC4',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.blackColor,
    marginBottom: 2,
  },
  userMobile: {
    fontSize: 10,
    color: Colors.grayColor,
  },
  badgeContainer: {
    alignItems: 'flex-end',
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  roleText: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  ticketContent: {
    marginBottom: 16,
  },
  ticketTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.blackColor,
    marginBottom: 6,
    lineHeight: 22,
  },
  ticketDescription: {
    fontSize: 12,
    color: Colors.grayColor,
    lineHeight: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusSection: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '600',
  },
  ratingSection: {
    alignItems: 'flex-end',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dateSection: {
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 10,
    color: Colors.grayColor,
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.extraLightGrayColor,
    marginTop: 12,
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
    padding: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.blackColor,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.blackColor,
    marginBottom: 12,
  },
  filterScroll: {
    marginVertical: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.lightGrayColor,
    backgroundColor: Colors.whiteColor,
    marginRight: 10,
  },
  selectedChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    color: Colors.grayColor,
  },
  selectedChipText: {
    color: Colors.whiteColor,
    fontWeight: '500',
  },
});

export default AllSupportIssues;
