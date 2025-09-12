import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { Colors } from '../../styles/commonStyles';
import MyStatusBar from '../../components/MyStatusBar';
import {
  CommonAppBar,
  ButtonWithLoader,
  FaddedIcon,
} from '../../components/commonComponents';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { updateTicket } from '../../store/thunks/adminThunk';
import { showSnackbar } from '../../store/slices/snackbarSlice';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const SupportIssueDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const ticket = route.params?.ticket || {};

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(ticket.status || 'OPEN');
  const [priority, setPriority] = useState(ticket.priority || 'LOW');
  const [type, setType] = useState(ticket.type || 'TECHNICAL');
  const [adminResponse, setAdminResponse] = useState(
    ticket.adminResponse || '',
  );

  const statusOptions = [
    'OPEN',
    'IN_PROGRESS',
    'RESOLVED',
    'CLOSED',
    'CANCELLED',
  ];
  const priorityOptions = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
  const typeOptions = ['TECHNICAL', 'GENERAL'];

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

  const formatDate = dateString => {
    if (!dateString) return 'Not Available';
    return new Date(dateString).toLocaleString();
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const ticketData = {
        status,
        priority,
        type,
        adminResponse: adminResponse.trim() || null,
      };

      const result = await dispatch(
        updateTicket({
          ticketId: ticket.id,
          ticketData,
        }),
      );

      if (updateTicket.fulfilled.match(result)) {
        dispatch(
          showSnackbar({
            message: 'Ticket updated successfully',
            type: 'success',
            time: 3000,
          }),
        );
        setIsEditing(false);
      } else {
        dispatch(
          showSnackbar({
            message: 'Failed to update ticket',
            type: 'error',
            time: 3000,
          }),
        );
      }
    } catch (error) {
      dispatch(
        showSnackbar({
          message: 'Failed to update ticket',
          type: 'error',
          time: 3000,
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  const renderSelector = (title, value, options, setValue) => (
    <View style={styles.selectorContainer}>
      <Text style={styles.selectorTitle}>{title}</Text>
      <View style={styles.selectorOptions}>
        {options.map(option => (
          <TouchableOpacity
            key={option}
            style={[
              styles.selectorOption,
              value === option && styles.selectedOption,
              title === 'Status' &&
                value === option && {
                  backgroundColor: getStatusColor(option) + '20',
                  borderColor: getStatusColor(option),
                },
              title === 'Priority' &&
                value === option && {
                  backgroundColor: getPriorityColor(option) + '20',
                  borderColor: getPriorityColor(option),
                },
            ]}
            onPress={() => setValue(option)}
          >
            <Text
              style={[
                styles.selectorOptionText,
                value === option && styles.selectedOptionText,
                title === 'Status' &&
                  value === option && { color: getStatusColor(option) },
                title === 'Priority' &&
                  value === option && { color: getPriorityColor(option) },
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <MyStatusBar />
      <CommonAppBar
        navigation={navigation}
        label={isEditing ? 'Edit Ticket' : 'Ticket Details'}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card */}
        <View style={styles.headerCard}>
          {/* User Information */}

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
                }}
          >
            <>
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
              <Text style={styles.ticketId}>#{ticket?.userId || 'N/A'}</Text>
          
            </>
          </View>
        </View>

        {/* Ticket Details */}
        <View style={styles.infoCard}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <Text style={[styles.cardTitle, { marginBottom: 0 }]}>
              Ticket Details
            </Text>
            <Text style={styles.ticketId}>#{ticket.id || 'N/A'}</Text>
          </View>
          {isEditing ? (
            <>
              {renderSelector('Status', status, statusOptions, setStatus)}
              {renderSelector(
                'Priority',
                priority,
                priorityOptions,
                setPriority,
              )}
              {renderSelector('Type', type, typeOptions, setType)}
            </>
          ) : (
            <>
              <View style={styles.infoRow}>
                <MaterialIcons name="info" size={20} color={Colors.primary} />
                <Text style={styles.infoLabel}>Status:</Text>
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: getStatusColor(ticket.status) },
                  ]}
                >
                  <Text style={styles.badgeText}>
                    {ticket.status || 'Not Available'}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <MaterialIcons
                  name="priority-high"
                  size={20}
                  color={Colors.primary}
                />
                <Text style={styles.infoLabel}>Priority:</Text>
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: getPriorityColor(ticket.priority) },
                  ]}
                >
                  <Text style={styles.badgeText}>
                    {ticket.priority || 'Not Available'}
                  </Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <MaterialIcons
                  name="category"
                  size={20}
                  color={Colors.primary}
                />
                <Text style={styles.infoLabel}>Type:</Text>
                <Text style={styles.infoValue}>
                  {ticket.type || 'Not Available'}
                </Text>
              </View>
              <View
                style={{
                  height: 1,
                  backgroundColor: Colors.extraLightGrayColor,
                  marginVertical: 10,
                }}
              />
              <View>
                <Text style={styles.subject}>
                  Ticket Subject : {ticket.subject || 'No Subject'}
                </Text>
                <Text style={styles.description}>
                  {ticket.description || 'No Description'}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Admin Response */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Admin Response</Text>
          {isEditing ? (
            <TextInput
              style={styles.responseInput}
              placeholder="Enter admin response..."
              placeholderTextColor={Colors.grayColor}
              value={adminResponse}
              onChangeText={setAdminResponse}
              multiline
              textAlignVertical="top"
            />
          ) : (
            <Text style={styles.responseText}>
              {ticket.adminResponse || 'No response provided yet'}
            </Text>
          )}
          {ticket.assignedAdminName && (
            <Text style={styles.adminName}>- {ticket.assignedAdminName}</Text>
          )}
        </View>

        {/* Timestamps */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Timeline</Text>
          <View style={styles.infoRow}>
            <MaterialIcons name="schedule" size={20} color={Colors.primary} />
            <Text style={styles.infoLabel}>Created:</Text>
            <Text style={styles.infoValue}>{formatDate(ticket.createdAt)}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="update" size={20} color={Colors.primary} />
            <Text style={styles.infoLabel}>Updated:</Text>
            <Text style={styles.infoValue}>{formatDate(ticket.updatedAt)}</Text>
          </View>
          {ticket.resolvedAt && (
            <View style={styles.infoRow}>
              <MaterialIcons
                name="check-circle"
                size={20}
                color={Colors.primary}
              />
              <Text style={styles.infoLabel}>Resolved:</Text>
              <Text style={styles.infoValue}>
                {formatDate(ticket.resolvedAt)}
              </Text>
            </View>
          )}
        </View>
        <FaddedIcon />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        {isEditing ? (
          <View style={styles.editButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setIsEditing(false);
                setStatus(ticket.status || 'OPEN');
                setPriority(ticket.priority || 'LOW');
                setType(ticket.type || 'TECHNICAL');
                setAdminResponse(ticket.adminResponse || '');
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <View style={styles.updateButtonWrapper}>
              <ButtonWithLoader
                name="Update"
                loadingName="Updating..."
                isLoading={loading}
                method={handleUpdate}
              />
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <MaterialIcons name="edit" size={20} color={Colors.whiteColor} />
            <Text style={styles.editButtonText}>Edit Ticket</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  headerCard: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ticketId: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.whiteColor,
  },
  subject: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.blackColor,
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    color: Colors.grayColor,
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.blackColor,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.blackColor,
    marginLeft: 8,
    minWidth: 80,
  },
  infoValue: {
    fontSize: 12,
    color: Colors.grayColor,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.whiteColor,
  },
  selectorContainer: {
    marginBottom: 16,
  },
  selectorTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.blackColor,
    marginBottom: 8,
  },
  selectorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectorOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.extraLightGrayColor,
    backgroundColor: Colors.whiteColor,
  },
  selectedOption: {
    backgroundColor: Colors.lightPrimary,
    borderColor: Colors.primary,
  },
  selectorOptionText: {
    fontSize: 10,
    color: Colors.grayColor,
  },
  selectedOptionText: {
    color: Colors.primary,
    fontWeight: '500',
  },
  responseInput: {
    borderWidth: 1,
    borderColor: Colors.extraLightGrayColor,
    borderRadius: 12,
    padding: 12,
    fontSize: 12,
    color: Colors.blackColor,
    minHeight: 100,
    backgroundColor: '#F8F9FA',
  },
  responseText: {
    fontSize: 12,
    color: Colors.blackColor,
    lineHeight: 22,
  },
  adminName: {
    fontSize: 10,
    color: Colors.grayColor,
    fontStyle: 'italic',
    textAlign: 'right',
    marginTop: 8,
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: Colors.whiteColor,
    borderTopWidth: 1,
    borderTopColor: Colors.extraLightGrayColor,
  },
  editButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  editButtonText: {
    color: Colors.whiteColor,
    fontSize: 14,
    fontWeight: '600',
  },
  editButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: Colors.whiteColor,
    fontSize: 14,
    fontWeight: '600',
  },
  updateButtonWrapper: {
    flex: 1,
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
});

export default SupportIssueDetail;
