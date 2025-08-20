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
import LargeProductCard from '../../components/userComponents/LargeProductCard';
import { Colors ,textStyles} from '../../styles/commonStyles';
import { products } from '../../utils/dummyData';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ButtonWithLoader } from '../../components/commonComponents';

// If RN CLI (remove the Expo import and use this):
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const filters = ['All', 'Shoes', 'Clothes', 'Bags', 'Accessories'];

const SearchScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const filteredProducts = products;
  const navigation = useNavigation(); 


  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor, padding: 10 }}>
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
      />
      <View style={{height:100 ,borderTopLeftRadius:8,borderTopRightRadius:8 ,overflow:"hidden" }}>
        <View style={{height:40}}>
        <View style={{height:20 ,backgroundColor:Colors.extraLightGrayColor}}>
        <Text style={{textAlign:"center",...textStyles.small}}>Total Selected Items to Sell : 10</Text>
        </View>
        </View>
       <ButtonWithLoader
            name="Sell Now"
            loadingName="Processing..."
            isLoading={loading}
            method={()=>{navigation.navigate("cart")}}
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
    marginHorizontal: 2 ,
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
