import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';

const Graph = () => {
  const [selectedYear, setSelectedYear] = useState(2025);
  
  // CUSTOMIZE: Add/modify your data here - supports unlimited years
  const dummydata = {
    2020: { jan: 15, feb: 25, march: 35, apr: 10, may: 40, jun: 30, jul: 45, aug: 25, sep: 35, oct: 50, nov: 20, dec: 40 },
    2021: { jan: 25, feb: 35, march: 20, apr: 50, may: 30, jun: 45, jul: 35, aug: 40, sep: 25, oct: 35, nov: 50, dec: 30 },
    2022: { jan: 30, feb: 20, march: 45, apr: 35, may: 25, jun: 50, jul: 40, aug: 30, sep: 45, oct: 25, nov: 35, dec: 55 },
    2023: { jan: 35, feb: 45, march: 25, apr: 40, may: 55, jun: 35, jul: 30, aug: 50, sep: 40, oct: 45, nov: 25, dec: 60 },
    2024: { jan: 40, feb: 30, march: 50, apr: 25, may: 45, jun: 60, jul: 35, aug: 40, sep: 30, oct: 55, nov: 45, dec: 35 },
    2025: { jan: 20, feb: 30, march: 10, apr: 45, may: 35, jun: 60, jul: 25, aug: 40, sep: 55, oct: 30, nov: 45, dec: 50 },
    2026: { jan: 35, feb: 25, march: 40, apr: 30, may: 50, jun: 45, jul: 60, aug: 35, sep: 40, oct: 55, nov: 30, dec: 65 },
    2027: { jan: 40, feb: 55, march: 30, apr: 5, may: 25, jun: 45, jul: 35, aug: 50, sep: 30, oct: 40, nov: 60, dec: 35 },
    2028: { jan: 25, feb: 40, march: 55, apr: 35, may: 50, jun: 30, jul: 45, aug: 25, sep: 60, oct: 35, nov: 40, dec: 50 },
    2029: { jan: 50, feb: 35, march: 25, apr: 55, may: 40, jun: 35, jul: 50, aug: 45, sep: 35, oct: 60, nov: 25, dec: 45 },
    2030: { jan: 45, feb: 60, march: 35, apr: 25, may: 55, jun: 40, jul: 25, aug: 55, sep: 45, oct: 30, nov: 60, dec: 40 }
  };

  const currentYearData = dummydata[selectedYear];
  const data = Object.values(currentYearData);
  const labels = Object.keys(currentYearData);
  const years = Object.keys(dummydata);
  const maxValue = Math.max(...data);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Monthly Collection Stats</Text>
        {/* CUSTOMIZE: Year selector - automatically scrollable for 10+ years */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.yearSelector}
        >
          {years.map(year => (
            <TouchableOpacity
              key={year}
              style={[
                styles.yearButton,
                selectedYear == year && styles.selectedYearButton
              ]}
              onPress={() => setSelectedYear(parseInt(year))}
            >
              <Text style={[
                styles.yearText,
                selectedYear == year && styles.selectedYearText
              ]}>
                {year}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.chartContainer}>
        <View style={styles.chart}>
          {data.map((value, index) => {
            // CUSTOMIZE: Change 120 to adjust max bar height
            const height = (value / maxValue) * 120;
            // CUSTOMIZE: Change threshold value (20) and colors for conditional styling
            const isLowValue = value < 40;
            const barColors = isLowValue 
              ? ['#FF9800', '#FFB74D'] // Orange gradient for low values
              : ['#4CAF50', '#81C784']; // Green gradient for normal values
            
            return (
              <View key={index} style={styles.barContainer}>
                <Text style={styles.valueText}>{value}</Text>
                {/* CUSTOMIZE: Conditional colors based on value */}
                <LinearGradient
                  colors={barColors}
                  style={[styles.bar, { height }]}
                />
                <Text style={styles.labelText}>{labels[index]}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default Graph;

const styles = StyleSheet.create({
  // CUSTOMIZE: Main container styling
  container: {
    backgroundColor: '#fff', // Change background color
    borderRadius: 16, // Change corner radius
    padding: 16, // Change padding
    marginVertical: 10, // Change vertical margin
    shadowColor: '#000', // Change shadow color
    shadowOpacity: 0.1, // Change shadow opacity
    shadowRadius: 6, // Change shadow blur
    elevation: 4, // Android shadow
  },
  header: {
    marginBottom: 16,
  },
  // CUSTOMIZE: Title styling
  title: {
    fontSize: 16, // Change title size
    fontWeight: 'bold', // Change font weight
    color: '#333', // Change title color
    textAlign: 'center',
    marginBottom: 12,
  },
  // CUSTOMIZE: Year selector container (now scrollable)
  yearSelector: {
    flexDirection: 'row',
    paddingHorizontal: 10, // Padding for scroll
    gap: 8, // Space between year buttons
  },
  // CUSTOMIZE: Year button styling
  yearButton: {
    paddingHorizontal: 12, // Button width
    paddingVertical: 6, // Button height
    borderRadius: 16, // Button corner radius
    backgroundColor: '#f0f0f0', // Unselected button color
    minWidth: 50, // Minimum button width
  },
  // CUSTOMIZE: Selected year button color
  selectedYearButton: {
    backgroundColor: '#4CAF50', // Selected button color
  },
  yearText: {
    fontSize: 10,
    color: '#666',
  },
  selectedYearText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  chartContainer: {
    alignItems: 'center',
  },
  // CUSTOMIZE: Chart container
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    width: '100%',
    height: 160, // Change chart height
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  // CUSTOMIZE: Bar styling - MADE THINNER
  bar: {
    width: 12, // CHANGED: Made bars thinner (was 20)
    borderRadius: 6, // CHANGED: Adjusted radius for thinner bars
    marginVertical: 4,
  },
  // CUSTOMIZE: Value text above bars
  valueText: {
    fontSize: 10, // Change value text size
    color: '#666', // Change value text color
    marginBottom: 2,
  },
  // CUSTOMIZE: Month labels below bars
  labelText: {
    fontSize: 8, // Change label text size
    color: '#666', // Change label text color
    marginTop: 4,
  },
});
