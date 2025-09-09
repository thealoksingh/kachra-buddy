import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import BestDealCard from '../../components/adminComponents/BestDealCard';
import { Colors, textStyles } from '../../styles/commonStyles';
import { products } from '../../utils/dummyData';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ButtonWithLoader } from '../../components/commonComponents';
import MyStatusBar from '../../components/MyStatusBar';

const filters = ['All', 'plastic', 'rubber', 'glass', 'aluminium', 'metal'];

// Golden Theme Colors
const goldenTheme = {
  primary: '#FFD700',        // Gold
  secondary: '#fec459ff',    // Orange Gold
  background: '#FFF8DC',     // Cornsilk
  cardBackground: '#FFFACD', // Lemon Chiffon
  text: '#8B4513',           // Saddle Brown
  textSecondary: '#d7832eff', // Peru
  border: '#DAA520',         // Goldenrod
  shadow: '#B8860B',         // Dark Goldenrod
  accent: '#e9c4a3ff',       // Sandy Brown
  white: '#FFFFFF',
  gradientStart: '#fcd279ff',  // Gold
  gradientEnd: '#ffe8beff',     // Orange
  greenishLight: '#b7ff97ff',
  greenishDark: '#8dca73ff', 
};

const AllBestDealProducts = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

 
  const filteredProducts = products.filter(item => {
    const textMatch =
      item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      item.type.toLowerCase().includes(searchText.toLowerCase());

    const filterMatch =
      selectedFilter === 'All' ||
      item.material.toLowerCase() === selectedFilter.toLowerCase();

    return textMatch && filterMatch;
  });

  return (
    <LinearGradient
      colors={[goldenTheme.gradientStart, goldenTheme.gradientEnd]}
      style={styles.container}
    >
      <StatusBar backgroundColor={goldenTheme.gradientStart} barStyle="dark-content" />
      
      <View style={styles.searchContainer}>
        <MaterialIcons
          name="search"
          size={20}
          color={goldenTheme.textSecondary}
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search items ..."
          placeholderTextColor={goldenTheme.textSecondary}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginVertical: 10, maxHeight: 40 }}
      >
        {filters.map(item => (
          <TouchableOpacity
            key={item}
            style={[
              styles.filterButton,
              selectedFilter === item && {
                borderColor: goldenTheme.primary,
                backgroundColor: goldenTheme.accent,
              },
            ]}
            onPress={() => setSelectedFilter(item)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === item && {
                  color: goldenTheme.text,
                  fontWeight: '600',
                },
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredProducts}
        keyExtractor={(_, i) => i.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.cardWrap}>
            <BestDealCard product={item} theme={goldenTheme} />
          </View>
        )}
        style={{ flex: 1 }}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: goldenTheme.textSecondary }]}>
            No products found
          </Text>
        }
      />
      
    </LinearGradient>
  );
};

export default AllBestDealProducts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: goldenTheme.cardBackground,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 45,
    shadowColor: goldenTheme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    marginHorizontal: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: goldenTheme.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: goldenTheme.text,
  },
  filterButton: {
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: goldenTheme.border,
    borderRadius: 20,
    paddingHorizontal: 15,
    minHeight: 30,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: goldenTheme.white,
  },
  filterText: {
    fontSize: 12,
    color: goldenTheme.textSecondary,
    textAlign: 'center',
  },
  cardWrap: {
    width: '48%',
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 100,
    right: 40,
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: goldenTheme.primary,
    backgroundColor: goldenTheme.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: goldenTheme.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  floatingButtonText: {
    fontSize: 24,
    color: goldenTheme.white,
    fontWeight: 'bold',
  },
});
