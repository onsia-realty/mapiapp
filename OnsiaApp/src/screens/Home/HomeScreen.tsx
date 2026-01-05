/**
 * 홈 화면
 * @description 검색바, 카테고리 그리드, 배너, 추천 매물 표시
 * @reference PDF 요구사항 12페이지 (메인화면)
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SearchBar, CategoryGrid, PropertyCard } from '../../components';
import { RootStackParamList, Property, PropertyCategory } from '../../types';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../utils/theme';

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 임시 더미 데이터 - 추천 매물
const DUMMY_PROPERTIES: Property[] = [
  {
    id: '1',
    category: 'presale',
    title: '힐스테이트 강남 센트럴',
    address: '서울시 강남구 역삼동 123-45',
    price: 85000,
    dealType: 'sale',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400'],
    description: '프리미엄 입지의 신축 분양권',
    exclusiveArea: 84.95,
    supplyArea: 112.5,
    floor: 15,
    totalFloor: 35,
    latitude: 37.5012,
    longitude: 127.0396,
    brokerId: 'broker1',
    brokerName: '온시아 공인중개사',
    brokerPhone: '010-1234-5678',
    viewCount: 1523,
    likeCount: 89,
    isLiked: false,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    category: 'apartment',
    title: '래미안 퍼스티지 301동',
    address: '서울시 서초구 반포동 10-1',
    price: 120000,
    dealType: 'sale',
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400'],
    description: '한강 조망 프리미엄 아파트',
    exclusiveArea: 114.5,
    supplyArea: 145.2,
    floor: 22,
    totalFloor: 45,
    latitude: 37.5045,
    longitude: 127.0108,
    brokerId: 'broker2',
    brokerName: '반포 부동산',
    brokerPhone: '010-2345-6789',
    viewCount: 2341,
    likeCount: 156,
    isLiked: true,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-12',
  },
  {
    id: '3',
    category: 'interestOnly',
    title: '이자만 투자형 오피스텔',
    address: '서울시 마포구 상암동 456',
    price: 35000,
    monthlyRent: 85,
    deposit: 3000,
    dealType: 'monthly',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'],
    description: '높은 수익률 보장 오피스텔',
    exclusiveArea: 28.5,
    latitude: 37.5795,
    longitude: 126.8925,
    brokerId: 'broker3',
    brokerName: '상암 부동산',
    brokerPhone: '010-3456-7890',
    viewCount: 892,
    likeCount: 45,
    isLiked: false,
    createdAt: '2024-01-18',
    updatedAt: '2024-01-18',
  },
  {
    id: '4',
    category: 'office',
    title: '테헤란로 프라임 오피스',
    address: '서울시 강남구 테헤란로 152',
    price: 50000,
    dealType: 'rent',
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=400'],
    description: '강남역 도보 3분 역세권 오피스',
    exclusiveArea: 165.5,
    supplyArea: 198.2,
    floor: 8,
    totalFloor: 20,
    latitude: 37.5000,
    longitude: 127.0400,
    brokerId: 'broker4',
    brokerName: '강남 오피스',
    brokerPhone: '010-4567-8901',
    viewCount: 567,
    likeCount: 23,
    isLiked: false,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
  },
];

// 배너 데이터
const BANNER_DATA = [
  { id: '1', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', title: '분양권 프리미엄 특집' },
  { id: '2', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', title: '수익형 부동산 특집' },
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const insets = useSafeAreaInsets();

  // 상태 관리
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [properties, setProperties] = useState<Property[]>(DUMMY_PROPERTIES);

  // 새로고침 처리
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // TODO: 실제 API 호출
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  }, []);

  // 검색 처리
  const handleSearch = () => {
    if (searchText.trim()) {
      navigation.navigate('Search', { keyword: searchText });
    }
  };

  // 검색 포커스 시 검색 화면으로 이동
  const handleSearchFocus = () => {
    navigation.navigate('Search', {});
  };

  // 카테고리 선택 처리
  const handleCategoryPress = (category: PropertyCategory) => {
    navigation.navigate('Filter', { category });
  };

  // 매물 상세 보기
  const handlePropertyPress = (propertyId: string) => {
    navigation.navigate('PropertyDetail', { propertyId });
  };

  // 좋아요 토글
  const handleLikePress = (propertyId: string) => {
    setProperties(prev =>
      prev.map(p =>
        p.id === propertyId
          ? { ...p, isLiked: !p.isLiked, likeCount: p.isLiked ? p.likeCount - 1 : p.likeCount + 1 }
          : p
      )
    );
  };

  // 알림 버튼 처리
  const handleNotificationPress = () => {
    // TODO: NotificationScreen으로 이동
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 헤더 영역 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="home-city" size={28} color={colors.primary} />
          <Text style={styles.headerTitle}>온시아</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton} onPress={handleNotificationPress}>
          <Icon name="bell-outline" size={24} color={colors.textPrimary} />
          {/* 알림 뱃지 */}
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* 검색바 */}
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          onSearch={handleSearch}
          onFocus={handleSearchFocus}
          placeholder="지역, 단지명, 매물 검색"
        />

        {/* 배너 슬라이더 */}
        <View style={styles.bannerContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.bannerScroll}
          >
            {BANNER_DATA.map((banner) => (
              <TouchableOpacity key={banner.id} style={styles.bannerItem} activeOpacity={0.9}>
                <Image source={{ uri: banner.image }} style={styles.bannerImage} />
                <View style={styles.bannerOverlay}>
                  <Text style={styles.bannerTitle}>{banner.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* 배너 인디케이터 */}
          <View style={styles.bannerIndicator}>
            {BANNER_DATA.map((_, index) => (
              <View key={index} style={[styles.indicatorDot, index === 0 && styles.indicatorDotActive]} />
            ))}
          </View>
        </View>

        {/* 카테고리 그리드 */}
        <CategoryGrid onCategoryPress={handleCategoryPress} />

        {/* 추천 매물 섹션 */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>추천 매물</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>더보기</Text>
              <Icon name="chevron-right" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* 매물 리스트 (가로 스크롤) */}
          <FlatList
            data={properties}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.propertyList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.propertyCardWrapper}>
                <PropertyCard
                  property={item}
                  onPress={() => handlePropertyPress(item.id)}
                  onLikePress={() => handleLikePress(item.id)}
                  variant="grid"
                />
              </View>
            )}
          />
        </View>

        {/* 인기 지역 섹션 */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>인기 지역</Text>
          <View style={styles.regionGrid}>
            {['강남구', '서초구', '송파구', '용산구', '마포구', '성동구'].map((region) => (
              <TouchableOpacity key={region} style={styles.regionChip}>
                <Icon name="map-marker" size={16} color={colors.primary} />
                <Text style={styles.regionText}>{region}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 하단 여백 */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundGray,
  },

  // 헤더
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  notificationButton: {
    position: 'relative',
    padding: spacing.xs,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.error,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    color: colors.textWhite,
  },

  scrollView: {
    flex: 1,
  },

  // 배너
  bannerContainer: {
    marginTop: spacing.sm,
  },
  bannerScroll: {
    marginHorizontal: spacing.base,
  },
  bannerItem: {
    width: SCREEN_WIDTH - spacing.base * 2,
    height: 150,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginRight: spacing.sm,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    padding: spacing.base,
  },
  bannerTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textWhite,
  },
  bannerIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  indicatorDotActive: {
    backgroundColor: colors.primary,
    width: 16,
  },

  // 섹션
  sectionContainer: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.base,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },

  // 매물 리스트
  propertyList: {
    paddingRight: spacing.base,
  },
  propertyCardWrapper: {
    marginRight: spacing.sm,
  },

  // 인기 지역
  regionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  regionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: borderRadius.full,
    ...shadows.sm,
  },
  regionText: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
});

export default HomeScreen;
