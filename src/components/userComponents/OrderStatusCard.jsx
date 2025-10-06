import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const OrderStatusCard = ({ bookingData }) => {
  const status = bookingData?.status;
  const driverName = bookingData?.driver?.fullName;

  const getSteps = () => {
    switch (status) {
      case 'INCOMPLETE':
        return [
          { label: 'Booking Pending', status: 'warning' },
          { label: 'Booking Confirmed', status: 'pending' },
          { label: 'Driver Allocated', status: 'pending' },
          { label: 'Out for Pickup', status: 'pending' },
          { label: 'Picked up', status: 'pending' },
        ];

      case 'COMPLETED':
        return [
          { label: 'Booking Confirmed', status: 'done' },
          { label: 'Driver Allocated', status: 'done' },
          { label: 'Out for Pickup', status: 'done' },
          { label: 'Picked up', status: 'done' },
        ];

      case 'ACTIVE':
        return [
          { label: 'Booking Confirmed', status: 'done' },
          {
            label: 'Driver Allocated',
            status: driverName ? 'done' : 'pending',
          },
          { label: 'Out for Pickup', status: 'pending' },
          { label: 'Picked up', status: 'pending' },
        ];

      case 'CANCELLED_BY_ADMIN':
        return [
          { label: 'Booking Confirmed', status: 'done' },
          { label: 'Cancelled by Admin', status: 'cancelled' },
        ];

      case 'CANCELLED_BY_DRIVER':
        return [
          { label: 'Booking Confirmed', status: 'done' },
          { label: 'Cancelled by Driver', status: 'cancelled' },
        ];

      case 'CANCELLED_BY_USER':
        return [
          { label: 'Booking Confirmed', status: 'done' },
          { label: 'Cancelled by User', status: 'cancelled' },
        ];

      case 'OUT_FOR_PICKUP':
        return [
          { label: 'Booking Confirmed', status: 'done' },
          { label: 'Driver Allocated', status: 'done' },
          { label: 'Out for Pickup', status: 'done' },
          { label: 'Picked up', status: 'pending' },
        ];

      default:
        return [
          { label: 'Booking Confirmed', status: 'pending' },
          { label: 'Driver Allocated', status: 'pending' },
          { label: 'Out for Pickup', status: 'pending' },
          { label: 'Picked up', status: 'pending' },
        ];
    }
  };

  const steps = getSteps();

  const getIcon = stepStatus => {
    if (stepStatus === 'done')
      return { name: 'checkmark-circle', color: '#22c55e' }; // green
    if (stepStatus === 'cancelled')
      return { name: 'close-circle', color: '#ef4444' }; // red
    if (stepStatus === 'warning')
      return { name: 'alert-circle', color: '#f5940bff' }; // orange
    return { name: 'ellipse-outline', color: '#9ca3af' }; // gray for pending
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Booking Status</Text>
      <View style={styles.progressContainer}>
        {steps.map((step, index) => {
          const icon = getIcon(step.status);
          return (
            <View key={index} style={styles.stepRow}>
              <View style={styles.iconColumn}>
                <Ionicons name={icon.name} size={22} color={icon.color} />
                {index !== steps.length - 1 && (
                  <View
                    style={[
                      styles.verticalLine,
                      {
                        backgroundColor:
                          step.status === 'done'
                            ? '#22c55e'
                            : step.status === 'cancelled'
                            ? '#ef4444'
                            : '#e5e7eb',
                      },
                    ]}
                  />
                )}
              </View>

              <View style={styles.textColumn}>
                <Text style={styles.stepLabel}>{step.label}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d0d1d3ff',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    color: '#111827',
  },
  progressContainer: {
    marginBottom: 16,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  iconColumn: {
    alignItems: 'center',
    width: 30,
    flexDirection: 'column',
  },

  verticalLine: {
    width: 2,
    flex: 1, 
    minHeight: 20,
    marginTop: 2,
  },

  textColumn: {
    flex: 1,
    paddingLeft: 8,
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
});

export default OrderStatusCard;
