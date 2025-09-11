import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../styles/commonStyles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export const TicketCard = ({ ticket }) => {
  const getStatusColor = status => {
    switch (status?.toUpperCase()) {
      case 'OPEN': return '#ff9800';
      case 'RESOLVED': return '#4caf50';
      case 'IN_PROGRESS': return '#2196f3';
      case 'CANCELLED': return '#f44336';
      case 'CLOSED': return '#4caf50';
      default: return '#757575';
    }
  };

  const getPriorityColor = priority => {
    switch (priority?.toUpperCase()) {
      case 'HIGH': return '#f44336';
      case 'MEDIUM': return '#ff9800';
      case 'LOW': return '#4caf50';
      default: return '#757575';
    }
  };

  const formatDateTime = dateString => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: getStatusColor(ticket?.status) }]}
      activeOpacity={0.8}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.ticketId}>#{ticket?.id}</Text>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(ticket?.priority) }]}>
            <Text style={styles.priorityText}>{ticket?.priority}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ticket?.status) }]}>
          <Text style={styles.statusText}>{ticket?.status}</Text>
        </View>
      </View>

      {/* Subject */}
      <Text style={styles.subject} numberOfLines={2}>
        {ticket?.subject || 'No Subject'}
      </Text>

      {/* Description */}
      <Text style={styles.description} numberOfLines={3}>
        {ticket?.description || 'No Description'}
      </Text>

      {/* User Info */}
      <View style={styles.userInfo}>
        <MaterialIcons name="person" size={16} color={Colors.grayColor} />
        <Text style={styles.userName}>{ticket?.userName}</Text>
        <Text style={styles.userContact}>• {ticket?.userContact}</Text>
      </View>

      {/* Admin Response */}
      {ticket?.adminResponse && (
        <View style={styles.adminResponseContainer}>
          <Text style={styles.adminResponseLabel}>Admin Response:</Text>
          <Text style={styles.adminResponse} numberOfLines={2}>
            {ticket.adminResponse}
          </Text>
          {ticket?.assignedAdminName && (
            <Text style={styles.adminName}>- {ticket.assignedAdminName}</Text>
          )}
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.typeContainer}>
          <MaterialIcons name="category" size={14} color={Colors.primary} />
          <Text style={styles.type}>{ticket?.type || 'GENERAL'}</Text>
        </View>
        <Text style={styles.date}>{formatDateTime(ticket?.createdAt)}</Text>
      </View>

      {/* Resolved/Updated Date */}
      {(ticket?.resolvedAt || ticket?.updatedAt) && (
        <View style={styles.timestampContainer}>
          {ticket?.resolvedAt && (
            <Text style={styles.timestamp}>
              Resolved: {formatDateTime(ticket.resolvedAt)}
            </Text>
          )}
          {ticket?.updatedAt && ticket?.updatedAt !== ticket?.createdAt && (
            <Text style={styles.timestamp}>
              Updated: {formatDateTime(ticket.updatedAt)}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ticketId: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.whiteColor,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
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
    lineHeight: 22,
  },
  description: {
    fontSize: 12,
    color: Colors.grayColor,
    lineHeight: 20,
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },
  userName: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.blackColor,
  },
  userContact: {
    fontSize: 10,
    color: Colors.grayColor,
  },
  adminResponseContainer: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  adminResponseLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 4,
  },
  adminResponse: {
    fontSize: 12,
    color: Colors.blackColor,
    lineHeight: 18,
    marginBottom: 4,
  },
  adminName: {
    fontSize: 10,
    color: Colors.grayColor,
    fontStyle: 'italic',
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  type: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: '500',
  },
  date: {
    fontSize: 10,
    color: Colors.grayColor,
  },
  timestampContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
    gap: 2,
  },
  timestamp: {
    fontSize: 10,
    color: Colors.grayColor,
    fontStyle: 'italic',
  },
});