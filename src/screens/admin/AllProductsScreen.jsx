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
} from 'react-native';
import LargeProductCardAdmin from '../../components/adminComponents/LargeProductCardAdmin';
import { Colors, textStyles } from '../../styles/commonStyles';
import { products } from '../../utils/dummyData';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ButtonWithLoader } from '../../components/commonComponents';
import MyStatusBar from '../../components/MyStatusBar';

const filters = ['All', 'plastic', 'rubber', 'glass', 'aluminium', 'metal'];

const AllProductsScreen = () => {
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
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor, padding: 10 }}>
     <MyStatusBar />
      <View style={styles.searchContainer}>
        <MaterialIcons
          name="search"
          size={20}
          color="#888"
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search items to Sell..."
          placeholderTextColor="#999"
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
                borderColor: Colors.primaryColor,
                backgroundColor: '#f0f8ff',
              },
            ]}
            onPress={() => setSelectedFilter(item)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === item && {
                  color: Colors.primaryColor,
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
            <LargeProductCardAdmin product={item} />
          </View>
        )}
        style={{ flex: 1 }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>
            No products found
          </Text>
        }
      />
      
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.floatingButton}
        onPress={() => navigation.navigate('postProductsScreen')}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AllProductsScreen;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 45,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    marginHorizontal: 5,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  filterButton: {
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    minHeight: 30,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
  cardWrap: {
    width: '48%',
    marginBottom: 12,
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
