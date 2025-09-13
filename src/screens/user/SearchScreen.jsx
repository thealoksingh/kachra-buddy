import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import { ButtonWithLoader } from '../../components/commonComponents';
import MyStatusBar from '../../components/MyStatusBar';
import LargeProductCard from '../../components/userComponents/LargeProductCard';
import { selectCart, selectItems } from '../../store/selector';
import { Colors, textStyles } from '../../styles/commonStyles';

const filters = ['All', 'Plastic', 'Rubber', 'Glass',  'Metal', 'Paper', 'E-waste'];

const SearchScreen = () => {
  const items = useSelector(selectItems);
  const cart = useSelector(selectCart);
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const filteredProducts = items.filter(item => {
    const textMatch = item?.name
      ?.toLowerCase()
      .includes(searchText.toLowerCase());

    const filterMatch =
      selectedFilter === 'All' ||
      item?.tags?.toLowerCase().includes(selectedFilter.toLowerCase());

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
            <LargeProductCard product={item} />
          </View>
        )}
        style={{ flex: 1 }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>
            No products found
          </Text>
        }
      />

      {/* 🔹 Bottom Section */}
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
              Total Selected Items to Sell : {cart?.cartItems?.length || 0}
            </Text>
          </View>
        </View>
        <ButtonWithLoader
          name="Sell Now"
          loadingName="Processing..."
          isLoading={loading}
          method={() => {
            navigation.navigate('cart');
          }}
        />
      </View>
    </View>
  );
};

export default SearchScreen;

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
});
