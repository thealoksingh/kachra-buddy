import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Colors, commonStyles, Sizes } from '../../styles/commonStyles';
import MyStatusBar from '../../components/MyStatusBar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CommonAppBar } from '../../components/commonComponents';
import { useNavigation } from '@react-navigation/native';
import { fetchAllAdvertisements } from '../../store/thunks/adminThunk';
import { selectAdvertisements } from '../../store/selector';
import Key from '../../constants/key';

const AllAdvertisementsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { API_BASE_URL } = Key;
  const [refreshing, setRefreshing] = useState(false);
  
  const advertisements = useSelector(selectAdvertisements);
  
  useEffect(() => {
    dispatch(fetchAllAdvertisements());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchAllAdvertisements());
    setRefreshing(false);
  };

  const handleAdPress = (advertisement) => {
    navigation.navigate('advertisementDetail', { advertisement });
  };

  const renderAdvertisement = ({ item }) => (
    <TouchableOpacity 
      style={styles.adCard} 
      onPress={() => handleAdPress(item)}
      activeOpacity={0.8}
    >
      <Image 
        source={{ 
          uri: item.imageUrl ? API_BASE_URL + item.imageUrl : 'https://via.placeholder.com/300x200',
        }} 
        style={styles.adImage} 
      />
      <View style={styles.adContent}>
        <Text style={styles.adTitle}>{item.title}</Text>
        <Text style={styles.adDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.adMeta}>
          <View style={[styles.statusBadge, { 
            backgroundColor: item.status === 'ACTIVE' ? Colors.lightPrimary : Colors.extraLightGrayColor 
          }]}>
            <Text style={[styles.statusText, { 
              color: item.status === 'ACTIVE' ? Colors.primary : Colors.grayColor 
            }]}>
              {item.status}
            </Text>
          </View>
          <Text style={styles.adSize}>{item.adSize}</Text>
        </View>
        <View style={styles.adStats}>
          <View style={styles.statItem}>
            <Icon name="visibility" size={16} color={Colors.grayColor} />
            <Text style={styles.statText}>{item.viewCount || 0}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="touch-app" size={16} color={Colors.grayColor} />
            <Text style={styles.statText}>{item.clickCount || 0}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <MyStatusBar />
      <CommonAppBar navigation={navigation} label="All Advertisements" />

      <FlatList
        data={advertisements}
        renderItem={renderAdvertisement}
        keyExtractor={item => item.id?.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="campaign" size={60} color={Colors.grayColor} />
            <Text style={styles.emptyText}>No advertisements found</Text>
          </View>
        }
      />

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.floatingButton}
        onPress={() => navigation.navigate('postAd')}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AllAdvertisementsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bodyBackColor,
  },
  listContainer: {
    paddingBottom: 100,
  },
  adCard: {
    backgroundColor: Colors.whiteColor,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    ...commonStyles.shadow,
    overflow: 'hidden',
  },
  adImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  adContent: {
    padding: 16,
  },
  adTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.blackColor,
    marginBottom: 8,
  },
  adDescription: {
    fontSize: 14,
    color: Colors.grayColor,
    marginBottom: 12,
    lineHeight: 20,
  },
  adMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  adSize: {
    fontSize: 12,
    color: Colors.grayColor,
    fontWeight: '500',
  },
  adStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: Colors.grayColor,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.grayColor,
    marginTop: 12,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
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