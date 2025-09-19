import { useNavigation, useRoute } from '@react-navigation/native';
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
import SelectItemCard from '../../components/driverComponents/SelectItemCard';
import { Colors, textStyles } from '../../styles/commonStyles';
import { products } from '../../utils/dummyData';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MyStatusBar from '../../components/MyStatusBar';
import { ButtonWithLoader } from '../../components/commonComponents';
import { useSelector } from 'react-redux';
import { selectAdminItems, selectAdminItemsRaw } from '../../store/selector';
const filters = ['All', 'plastic', 'rubber', 'glass', 'aluminium', 'metal'];

const SelectAdditionalItemScreen = () => {
  const route = useRoute();
  const { onItemSelect, currentOrderItems } = route.params || {};
  console.log('currentOrderItems ===>', currentOrderItems); 

  const existingName = new Set(currentOrderItems?.map(item => item?.item?.name));

  const [selectedItem, setSelectedItem] = useState([]);

  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const items = useSelector(selectAdminItemsRaw);
  // console.log('Items at admin panel ===>', items); 


  const handleSelect = () => {
    console.log('selected items', selectedItem);
    if (onItemSelect) {
      onItemSelect(selectedItem);
    }
    navigation.goBack();
  };

  const toggleSelect = item => {
    const exists = selectedItem.some(i => i.id === item.id);
    if (exists) {
      setSelectedItem(selectedItem.filter(i => i.id !== item.id));
    } else {
      setSelectedItem([...selectedItem, item]);
    }
  };

  const filteredProducts = (items || []).filter(item => {
    if (!item) return false;

    const itemName = item.name || item.title || '';
    const itemCategory = item.category || item.type || item.material || '';

    const textMatch =
      itemName.toLowerCase().includes(searchText.toLowerCase()) ||
      itemCategory.toLowerCase().includes(searchText.toLowerCase());

    const filterMatch =
      selectedFilter === 'All' ||
      itemCategory.toLowerCase() === selectedFilter.toLowerCase();

    return textMatch && filterMatch;
  });



  const availableProducts = filteredProducts?.filter(
    p => !existingName.has(p?.name),
  );

  
  // console.log('availableProducts ===>', availableProducts);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor, padding: 10 }}>
      <MyStatusBar />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons
          name="search"
          size={20}
          color="#888"
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search items to add..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Filters */}
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

      {/* Product List */}
      <FlatList
        data={availableProducts} // ✅ only non-duplicate products
        keyExtractor={item => item?.id?.toString() || Math.random().toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => toggleSelect(item)}
            activeOpacity={0.8}
          >
            <SelectItemCard
              product={item}
              selected={selectedItem.some(i => i.id === item.id)}
            />
          </TouchableOpacity>
        )}
        style={{ flex: 1 }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>
            No products found
          </Text>
        }
      />

      {/* Bottom Section */}
      <View
        style={{
          height: 100,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          overflow: 'hidden',
        }}
      >
        <View style={{ height: 40 }}>
          <View
            style={{
              height: 20,
              backgroundColor: Colors.extraLightGrayColor,
            }}
          >
            <Text style={{ textAlign: 'center', ...textStyles.small }}>
              Total Item Selected : {selectedItem.length}
            </Text>
          </View>
        </View>
        <ButtonWithLoader
          name="Select"
          loadingName="Processing..."
          isLoading={loading}
          method={handleSelect}
        />
      </View>
    </View>
  );
};

export default SelectAdditionalItemScreen;

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
});
