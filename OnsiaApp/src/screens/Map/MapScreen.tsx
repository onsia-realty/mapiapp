/**
 * 지도 검색 화면
 * @description 지도 기반 매물 검색, 필터 바텀시트
 * @reference PDF 요구사항 13, 17, 29, 34, 45페이지 (지도 검색)
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FilterBottomSheet, PropertyCard } from '../../components';
import { RootStackParamList, Property, PropertyFilter, PropertyCategory, MapMarker } from '../../types';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows, categoryConfig } from '../../utils/theme';
import { formatPrice } from '../../utils/helpers';

type MapNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 임시 더미 마커 데이터
const DUMMY_MARKERS: MapMarker[] = [
  { id: '1', latitude: 37.5012, longitude: 127.0396, title: '힐스테이트 강남', price: '8.5억', category: 'presale' },
  { id: '2', latitude: 37.5045, longitude: 127.0108, title: '래미안 퍼스티지', price: '12억', category: 'apartment' },
  { id: '3', latitude: 37.5100, longitude: 127.0300, title: '상암 오피스텔', price: '3.5억', category: 'interestOnly' },
  { id: '4', latitude: 37.4980, longitude: 127.0280, title: '테헤란로 오피스', price: '5억', category: 'office' },
  { id: '5', latitude: 37.5060, longitude: 127.0450, title: '삼성동 분양권', price: '9억', category: 'presale' },
];

// 필터 카테고리 탭
const FILTER_TABS: { key: PropertyCategory | 'all'; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'presale', label: '분양권전매' },
  { key: 'interestOnly', label: '이자만' },
  { key: 'profitable', label: '수익형' },
  { key: 'office', label: '사무실' },
  { key: 'apartment', label: '아파트' },
];

const MapScreen: React.FC = () => {
  const navigation = useNavigation<MapNavigationProp>();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);

  // 상태 관리
  const [selectedCategory, setSelectedCategory] = useState<PropertyCategory | 'all'>('all');
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [filter, setFilter] = useState<PropertyFilter>({});
  const [showListView, setShowListView] = useState(false);

  // 지도 초기 위치 (서울 강남)
  const [region, setRegion] = useState<Region>({
    latitude: 37.5035,
    longitude: 127.0300,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });

  // 리스트 뷰 애니메이션
  const listViewHeight = useRef(new Animated.Value(0)).current;

  // 카테고리 필터링된 마커
  const filteredMarkers = selectedCategory === 'all'
    ? DUMMY_MARKERS
    : DUMMY_MARKERS.filter(m => m.category === selectedCategory);

  // 카테고리 탭 선택
  const handleCategorySelect = (category: PropertyCategory | 'all') => {
    setSelectedCategory(category);
    setSelectedMarker(null);
  };

  // 마커 선택
  const handleMarkerPress = (markerId: string) => {
    setSelectedMarker(markerId);

    // 선택된 마커로 지도 이동
    const marker = DUMMY_MARKERS.find(m => m.id === markerId);
    if (marker && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: marker.latitude,
        longitude: marker.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  // 필터 적용
  const handleFilterApply = (newFilter: PropertyFilter) => {
    setFilter(newFilter);
    // TODO: 필터 기반으로 마커 재조회
  };

  // 리스트 뷰 토글
  const toggleListView = () => {
    const toValue = showListView ? 0 : SCREEN_HEIGHT * 0.4;
    Animated.spring(listViewHeight, {
      toValue,
      useNativeDriver: false,
    }).start();
    setShowListView(!showListView);
  };

  // 현재 위치로 이동
  const handleMyLocationPress = () => {
    // TODO: 실제 위치 정보 가져오기
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: 37.5035,
        longitude: 127.0300,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  // 매물 상세 보기
  const handlePropertyPress = (propertyId: string) => {
    navigation.navigate('PropertyDetail', { propertyId });
  };

  // 마커 색상 가져오기
  const getMarkerColor = (category: PropertyCategory): string => {
    return categoryConfig[category]?.color || colors.primary;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 상단 필터 탭 */}
      <View style={[styles.filterTabContainer, { marginTop: insets.top > 0 ? 0 : spacing.sm }]}>
        <FlatList
          data={FILTER_TABS}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabList}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterTab,
                selectedCategory === item.key && styles.filterTabActive,
              ]}
              onPress={() => handleCategorySelect(item.key)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  selectedCategory === item.key && styles.filterTabTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* 상세 필터 버튼 */}
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterSheet(true)}
        >
          <Icon name="tune-variant" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* 지도 */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {filteredMarkers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            onPress={() => handleMarkerPress(marker.id)}
          >
            {/* 커스텀 마커 */}
            <View style={styles.markerContainer}>
              <View
                style={[
                  styles.markerBubble,
                  { backgroundColor: getMarkerColor(marker.category) },
                  selectedMarker === marker.id && styles.markerBubbleSelected,
                ]}
              >
                <Text style={styles.markerPrice}>{marker.price}</Text>
              </View>
              <View
                style={[
                  styles.markerArrow,
                  { borderTopColor: getMarkerColor(marker.category) },
                ]}
              />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* 플로팅 버튼들 */}
      <View style={styles.floatingButtons}>
        {/* 현재 위치 버튼 */}
        <TouchableOpacity style={styles.floatingButton} onPress={handleMyLocationPress}>
          <Icon name="crosshairs-gps" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        {/* 리스트 보기 버튼 */}
        <TouchableOpacity style={styles.floatingButton} onPress={toggleListView}>
          <Icon name={showListView ? 'map' : 'format-list-bulleted'} size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* 선택된 매물 미리보기 카드 */}
      {selectedMarker && !showListView && (
        <View style={styles.previewCard}>
          <TouchableOpacity
            style={styles.previewContent}
            onPress={() => handlePropertyPress(selectedMarker)}
          >
            <View style={styles.previewImagePlaceholder}>
              <Icon name="home" size={32} color={colors.textLight} />
            </View>
            <View style={styles.previewInfo}>
              <Text style={styles.previewPrice}>
                {DUMMY_MARKERS.find(m => m.id === selectedMarker)?.price}
              </Text>
              <Text style={styles.previewTitle} numberOfLines={1}>
                {DUMMY_MARKERS.find(m => m.id === selectedMarker)?.title}
              </Text>
              <Text style={styles.previewMeta}>상세보기 →</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.previewCloseButton}
            onPress={() => setSelectedMarker(null)}
          >
            <Icon name="close" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      )}

      {/* 리스트 뷰 바텀시트 */}
      <Animated.View style={[styles.listViewContainer, { height: listViewHeight }]}>
        <View style={styles.listViewHandle}>
          <View style={styles.handleBar} />
        </View>
        <Text style={styles.listViewTitle}>
          {filteredMarkers.length}개 매물
        </Text>
        <FlatList
          data={filteredMarkers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listViewContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => handlePropertyPress(item.id)}
            >
              <View style={styles.listItemImage}>
                <Icon name="home" size={24} color={colors.textLight} />
              </View>
              <View style={styles.listItemInfo}>
                <Text style={styles.listItemPrice}>{item.price}</Text>
                <Text style={styles.listItemTitle}>{item.title}</Text>
              </View>
              <Icon name="chevron-right" size={20} color={colors.textLight} />
            </TouchableOpacity>
          )}
        />
      </Animated.View>

      {/* 필터 바텀시트 */}
      <FilterBottomSheet
        visible={showFilterSheet}
        onClose={() => setShowFilterSheet(false)}
        onApply={handleFilterApply}
        initialFilter={filter}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // 필터 탭
  filterTabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    zIndex: 10,
  },
  filterTabList: {
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
  },
  filterTab: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.backgroundGray,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  filterTabText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  filterTabTextActive: {
    color: colors.textWhite,
    fontWeight: fontWeight.semibold,
  },
  filterButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.base,
  },

  // 지도
  map: {
    flex: 1,
  },

  // 마커
  markerContainer: {
    alignItems: 'center',
  },
  markerBubble: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  markerBubbleSelected: {
    transform: [{ scale: 1.1 }],
  },
  markerPrice: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.textWhite,
  },
  markerArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },

  // 플로팅 버튼
  floatingButtons: {
    position: 'absolute',
    right: spacing.base,
    bottom: 120,
    gap: spacing.sm,
  },
  floatingButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },

  // 미리보기 카드
  previewCard: {
    position: 'absolute',
    left: spacing.base,
    right: spacing.base,
    bottom: 100,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    ...shadows.lg,
  },
  previewContent: {
    flexDirection: 'row',
    padding: spacing.base,
  },
  previewImagePlaceholder: {
    width: 80,
    height: 70,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewInfo: {
    flex: 1,
    marginLeft: spacing.sm,
    justifyContent: 'center',
  },
  previewPrice: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  previewTitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: 2,
  },
  previewMeta: {
    fontSize: fontSize.sm,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  previewCloseButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    padding: spacing.xs,
  },

  // 리스트 뷰
  listViewContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    ...shadows.lg,
  },
  listViewHandle: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  listViewTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    paddingHorizontal: spacing.base,
    marginBottom: spacing.sm,
  },
  listViewContent: {
    paddingHorizontal: spacing.base,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  listItemImage: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  listItemPrice: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  listItemTitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

export default MapScreen;
