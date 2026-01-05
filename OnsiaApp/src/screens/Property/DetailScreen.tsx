/**
 * 매물 상세 화면
 * @description 이미지 슬라이더, 매물 정보, 건축물대장, 하단 고정 버튼
 * @reference PDF 요구사항 (매물 상세 화면들)
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  Linking,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Header } from '../../components';
import { RootStackParamList, Property, BuildingLedger } from '../../types';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows, categoryConfig } from '../../utils/theme';
import { formatPrice, formatArea, formatDate, formatPhoneNumber } from '../../utils/helpers';

type DetailNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type DetailRouteProp = RouteProp<RootStackParamList, 'PropertyDetail'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 임시 더미 데이터
const DUMMY_PROPERTY: Property = {
  id: '1',
  category: 'presale',
  title: '힐스테이트 강남 센트럴 84A타입',
  address: '서울특별시 강남구 역삼동 123-45',
  addressDetail: '힐스테이트 강남 센트럴 1501호',
  price: 85000,
  dealType: 'sale',
  images: [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
  ],
  description: '강남역 도보 5분 거리의 프리미엄 신축 아파트입니다.\n\n• 남향 채광 우수\n• 풀옵션 (에어컨, 냉장고, 세탁기 등)\n• 커뮤니티 시설 (피트니스, 사우나, 독서실)\n• 주차 2대 가능\n\n입주 가능일: 협의 가능',
  exclusiveArea: 84.95,
  supplyArea: 112.5,
  floor: 15,
  totalFloor: 35,
  buildingYear: 2024,
  latitude: 37.5012,
  longitude: 127.0396,
  brokerId: 'broker1',
  brokerName: '온시아 공인중개사사무소',
  brokerPhone: '010-1234-5678',
  viewCount: 1523,
  likeCount: 89,
  isLiked: false,
  createdAt: '2024-01-15',
  updatedAt: '2024-01-15',
};

const DUMMY_BUILDING_LEDGER: BuildingLedger = {
  propertyId: '1',
  buildingName: '힐스테이트 강남 센트럴',
  mainUse: '공동주택(아파트)',
  totalFloorArea: 125890.5,
  buildingArea: 4523.8,
  landArea: 15234.2,
  structure: '철근콘크리트조',
  roofType: '철근콘크리트슬래브',
  floors: '지하 3층 / 지상 35층',
  height: 115.2,
  approvalDate: '2024-02-01',
};

const DetailScreen: React.FC = () => {
  const navigation = useNavigation<DetailNavigationProp>();
  const route = useRoute<DetailRouteProp>();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  // 상태 관리
  const [property, setProperty] = useState<Property>(DUMMY_PROPERTY);
  const [buildingLedger] = useState<BuildingLedger>(DUMMY_BUILDING_LEDGER);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(property.isLiked);
  const [showAllDescription, setShowAllDescription] = useState(false);

  // 카테고리 정보
  const categoryInfo = categoryConfig[property.category as keyof typeof categoryConfig];

  // 거래 유형 텍스트
  const getDealTypeText = () => {
    switch (property.dealType) {
      case 'sale': return '매매';
      case 'rent': return '전세';
      case 'monthly': return '월세';
      default: return '';
    }
  };

  // 이미지 스크롤 핸들러
  const handleImageScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentImageIndex(index);
  };

  // 좋아요 토글
  const handleLikePress = () => {
    setIsLiked(!isLiked);
    // TODO: API 호출
  };

  // 공유하기
  const handleSharePress = async () => {
    try {
      await Share.share({
        message: `[온시아] ${property.title}\n가격: ${formatPrice(property.price)}\n주소: ${property.address}`,
        url: `https://onsia.app/property/${property.id}`,
      });
    } catch (error) {
      console.error('공유 실패:', error);
    }
  };

  // 전화하기
  const handleCallPress = () => {
    const phoneUrl = `tel:${property.brokerPhone}`;
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(phoneUrl);
        } else {
          Alert.alert('오류', '전화 기능을 사용할 수 없습니다.');
        }
      });
  };

  // 문자하기
  const handleMessagePress = () => {
    const smsUrl = `sms:${property.brokerPhone}?body=[온시아] ${property.title} 매물 문의드립니다.`;
    Linking.canOpenURL(smsUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(smsUrl);
        } else {
          Alert.alert('오류', '문자 기능을 사용할 수 없습니다.');
        }
      });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 헤더 */}
      <Header
        showBack
        onBackPress={() => navigation.goBack()}
        rightIcon="share-variant"
        onRightPress={handleSharePress}
        transparent
      />

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* 이미지 슬라이더 */}
        <View style={styles.imageSlider}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleImageScroll}
            scrollEventThrottle={16}
          >
            {property.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.sliderImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* 이미지 인디케이터 */}
          <View style={styles.imageIndicator}>
            <Text style={styles.imageIndicatorText}>
              {currentImageIndex + 1} / {property.images.length}
            </Text>
          </View>

          {/* 좋아요 버튼 */}
          <TouchableOpacity style={styles.likeButtonFloat} onPress={handleLikePress}>
            <Icon
              name={isLiked ? 'heart' : 'heart-outline'}
              size={28}
              color={isLiked ? colors.error : colors.textWhite}
            />
          </TouchableOpacity>
        </View>

        {/* 기본 정보 */}
        <View style={styles.infoSection}>
          {/* 카테고리 뱃지 */}
          <View style={[styles.categoryBadge, { backgroundColor: categoryInfo?.color }]}>
            <Text style={styles.categoryText}>{categoryInfo?.label}</Text>
          </View>

          {/* 가격 */}
          <View style={styles.priceRow}>
            <Text style={styles.dealType}>{getDealTypeText()}</Text>
            <Text style={styles.price}>{formatPrice(property.price)}</Text>
          </View>

          {/* 제목 */}
          <Text style={styles.title}>{property.title}</Text>

          {/* 주소 */}
          <View style={styles.addressRow}>
            <Icon name="map-marker" size={16} color={colors.textSecondary} />
            <Text style={styles.address}>{property.address}</Text>
          </View>

          {/* 조회수/좋아요 */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Icon name="eye" size={16} color={colors.textLight} />
              <Text style={styles.statText}>{property.viewCount.toLocaleString()}</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="heart" size={16} color={colors.textLight} />
              <Text style={styles.statText}>{property.likeCount}</Text>
            </View>
            <Text style={styles.statDate}>{formatDate(property.createdAt)} 등록</Text>
          </View>
        </View>

        {/* 구분선 */}
        <View style={styles.divider} />

        {/* 상세 정보 테이블 */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>매물 정보</Text>

          <View style={styles.infoTable}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>전용면적</Text>
              <Text style={styles.infoValue}>{formatArea(property.exclusiveArea)}</Text>
            </View>
            {property.supplyArea && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>공급면적</Text>
                <Text style={styles.infoValue}>{formatArea(property.supplyArea)}</Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>해당층/총층</Text>
              <Text style={styles.infoValue}>{property.floor}층 / {property.totalFloor}층</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>준공년도</Text>
              <Text style={styles.infoValue}>{property.buildingYear}년</Text>
            </View>
          </View>
        </View>

        {/* 구분선 */}
        <View style={styles.divider} />

        {/* 상세 설명 */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>상세 설명</Text>
          <Text
            style={styles.description}
            numberOfLines={showAllDescription ? undefined : 5}
          >
            {property.description}
          </Text>
          {property.description.length > 200 && (
            <TouchableOpacity onPress={() => setShowAllDescription(!showAllDescription)}>
              <Text style={styles.moreButton}>
                {showAllDescription ? '접기' : '더보기'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 구분선 */}
        <View style={styles.divider} />

        {/* 건축물대장 정보 */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>건축물대장 정보</Text>

          <View style={styles.ledgerTable}>
            <View style={styles.ledgerRow}>
              <Text style={styles.ledgerLabel}>건물명</Text>
              <Text style={styles.ledgerValue}>{buildingLedger.buildingName}</Text>
            </View>
            <View style={styles.ledgerRow}>
              <Text style={styles.ledgerLabel}>주용도</Text>
              <Text style={styles.ledgerValue}>{buildingLedger.mainUse}</Text>
            </View>
            <View style={styles.ledgerRow}>
              <Text style={styles.ledgerLabel}>연면적</Text>
              <Text style={styles.ledgerValue}>{buildingLedger.totalFloorArea.toLocaleString()}㎡</Text>
            </View>
            <View style={styles.ledgerRow}>
              <Text style={styles.ledgerLabel}>건축면적</Text>
              <Text style={styles.ledgerValue}>{buildingLedger.buildingArea.toLocaleString()}㎡</Text>
            </View>
            <View style={styles.ledgerRow}>
              <Text style={styles.ledgerLabel}>대지면적</Text>
              <Text style={styles.ledgerValue}>{buildingLedger.landArea.toLocaleString()}㎡</Text>
            </View>
            <View style={styles.ledgerRow}>
              <Text style={styles.ledgerLabel}>구조</Text>
              <Text style={styles.ledgerValue}>{buildingLedger.structure}</Text>
            </View>
            <View style={styles.ledgerRow}>
              <Text style={styles.ledgerLabel}>층수</Text>
              <Text style={styles.ledgerValue}>{buildingLedger.floors}</Text>
            </View>
            <View style={styles.ledgerRow}>
              <Text style={styles.ledgerLabel}>높이</Text>
              <Text style={styles.ledgerValue}>{buildingLedger.height}m</Text>
            </View>
            <View style={styles.ledgerRow}>
              <Text style={styles.ledgerLabel}>사용승인일</Text>
              <Text style={styles.ledgerValue}>{formatDate(buildingLedger.approvalDate)}</Text>
            </View>
          </View>
        </View>

        {/* 구분선 */}
        <View style={styles.divider} />

        {/* 중개사 정보 */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>중개사 정보</Text>

          <View style={styles.brokerCard}>
            <View style={styles.brokerAvatar}>
              <Icon name="account" size={32} color={colors.textLight} />
            </View>
            <View style={styles.brokerInfo}>
              <Text style={styles.brokerName}>{property.brokerName}</Text>
              <Text style={styles.brokerPhone}>{formatPhoneNumber(property.brokerPhone)}</Text>
            </View>
          </View>
        </View>

        {/* 하단 여백 */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* 하단 고정 버튼 */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom || spacing.base }]}>
        {/* 찜하기 버튼 */}
        <TouchableOpacity style={styles.bottomButton} onPress={handleLikePress}>
          <Icon
            name={isLiked ? 'heart' : 'heart-outline'}
            size={24}
            color={isLiked ? colors.error : colors.textSecondary}
          />
          <Text style={[styles.bottomButtonText, isLiked && { color: colors.error }]}>
            찜하기
          </Text>
        </TouchableOpacity>

        {/* 전화하기 버튼 */}
        <TouchableOpacity
          style={[styles.bottomMainButton, { backgroundColor: colors.primary }]}
          onPress={handleCallPress}
        >
          <Icon name="phone" size={22} color={colors.textWhite} />
          <Text style={styles.bottomMainButtonText}>전화하기</Text>
        </TouchableOpacity>

        {/* 문자하기 버튼 */}
        <TouchableOpacity
          style={[styles.bottomMainButton, { backgroundColor: colors.naver }]}
          onPress={handleMessagePress}
        >
          <Icon name="message-text" size={22} color={colors.textWhite} />
          <Text style={styles.bottomMainButtonText}>문자하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    marginTop: -56,  // 헤더 높이만큼 위로
  },

  // 이미지 슬라이더
  imageSlider: {
    height: 300,
    position: 'relative',
  },
  sliderImage: {
    width: SCREEN_WIDTH,
    height: 300,
  },
  imageIndicator: {
    position: 'absolute',
    bottom: spacing.base,
    right: spacing.base,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  imageIndicatorText: {
    fontSize: fontSize.sm,
    color: colors.textWhite,
  },
  likeButtonFloat: {
    position: 'absolute',
    bottom: spacing.base,
    left: spacing.base,
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 정보 섹션
  infoSection: {
    padding: spacing.base,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  categoryText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textWhite,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
  },
  dealType: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
  },
  price: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  address: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.base,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: fontSize.sm,
    color: colors.textLight,
  },
  statDate: {
    fontSize: fontSize.sm,
    color: colors.textLight,
    marginLeft: 'auto',
  },

  // 구분선
  divider: {
    height: 8,
    backgroundColor: colors.backgroundGray,
  },

  // 섹션 타이틀
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.base,
  },

  // 정보 테이블
  infoTable: {
    backgroundColor: colors.backgroundGray,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  infoLabel: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
  },

  // 상세 설명
  description: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  moreButton: {
    fontSize: fontSize.md,
    color: colors.primary,
    marginTop: spacing.sm,
  },

  // 건축물대장
  ledgerTable: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  ledgerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  ledgerLabel: {
    width: 100,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    backgroundColor: colors.backgroundGray,
    padding: spacing.sm,
  },
  ledgerValue: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    padding: spacing.sm,
  },

  // 중개사 정보
  brokerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundGray,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
  },
  brokerAvatar: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brokerInfo: {
    marginLeft: spacing.base,
  },
  brokerName: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  brokerPhone: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // 하단 바
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  bottomButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.base,
  },
  bottomButtonText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  bottomMainButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  bottomMainButtonText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.textWhite,
  },
});

export default DetailScreen;
