/**
 * 매물 카드 컴포넌트
 * @description 홈 화면 및 리스트에서 사용하는 매물 정보 카드
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Property, PropertyCategory } from '../../types';
import { colors, fontSize, fontWeight, borderRadius, spacing, shadows, categoryConfig } from '../../utils/theme';
import { formatPrice, formatArea, shortenAddress } from '../../utils/helpers';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - spacing.base * 3) / 2;

interface PropertyCardProps {
  property: Property;
  onPress: () => void;
  onLikePress?: () => void;
  variant?: 'grid' | 'list';
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onPress,
  onLikePress,
  variant = 'grid',
}) => {
  const {
    images,
    title,
    address,
    price,
    monthlyRent,
    deposit,
    dealType,
    exclusiveArea,
    category,
    isLiked,
  } = property;

  // 카테고리 설정 가져오기
  const categoryInfo = categoryConfig[category as keyof typeof categoryConfig];

  // 가격 표시 형식
  const renderPrice = () => {
    if (dealType === 'monthly' && deposit && monthlyRent) {
      return `${formatPrice(deposit)}/${formatPrice(monthlyRent)}`;
    }
    return formatPrice(price);
  };

  // 거래 유형 텍스트
  const getDealTypeText = () => {
    switch (dealType) {
      case 'sale':
        return '매매';
      case 'rent':
        return '전세';
      case 'monthly':
        return '월세';
      default:
        return '';
    }
  };

  // 그리드 레이아웃
  if (variant === 'grid') {
    return (
      <TouchableOpacity style={styles.gridContainer} onPress={onPress} activeOpacity={0.8}>
        {/* 이미지 */}
        <View style={styles.gridImageContainer}>
          <Image
            source={{ uri: images[0] || 'https://via.placeholder.com/200' }}
            style={styles.gridImage}
            resizeMode="cover"
          />

          {/* 카테고리 뱃지 */}
          <View style={[styles.categoryBadge, { backgroundColor: categoryInfo?.color || colors.primary }]}>
            <Text style={styles.categoryText}>{categoryInfo?.label || category}</Text>
          </View>

          {/* 좋아요 버튼 */}
          <TouchableOpacity
            style={styles.likeButton}
            onPress={(e) => {
              e.stopPropagation();
              onLikePress?.();
            }}
          >
            <Icon
              name={isLiked ? 'heart' : 'heart-outline'}
              size={22}
              color={isLiked ? colors.error : colors.textWhite}
            />
          </TouchableOpacity>
        </View>

        {/* 정보 */}
        <View style={styles.gridInfo}>
          <View style={styles.dealTypeBadge}>
            <Text style={styles.dealTypeText}>{getDealTypeText()}</Text>
          </View>

          <Text style={styles.gridPrice}>{renderPrice()}</Text>

          <Text style={styles.gridTitle} numberOfLines={1}>
            {title}
          </Text>

          <Text style={styles.gridAddress} numberOfLines={1}>
            {shortenAddress(address)}
          </Text>

          <Text style={styles.gridArea}>{formatArea(exclusiveArea)}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  // 리스트 레이아웃
  return (
    <TouchableOpacity style={styles.listContainer} onPress={onPress} activeOpacity={0.8}>
      {/* 이미지 */}
      <View style={styles.listImageContainer}>
        <Image
          source={{ uri: images[0] || 'https://via.placeholder.com/120' }}
          style={styles.listImage}
          resizeMode="cover"
        />

        {/* 카테고리 뱃지 */}
        <View style={[styles.categoryBadge, { backgroundColor: categoryInfo?.color || colors.primary }]}>
          <Text style={styles.categoryText}>{categoryInfo?.label || category}</Text>
        </View>
      </View>

      {/* 정보 */}
      <View style={styles.listInfo}>
        <View style={styles.listHeader}>
          <View style={styles.dealTypeBadge}>
            <Text style={styles.dealTypeText}>{getDealTypeText()}</Text>
          </View>

          <TouchableOpacity onPress={onLikePress}>
            <Icon
              name={isLiked ? 'heart' : 'heart-outline'}
              size={22}
              color={isLiked ? colors.error : colors.textLight}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.listPrice}>{renderPrice()}</Text>

        <Text style={styles.listTitle} numberOfLines={2}>
          {title}
        </Text>

        <View style={styles.listMeta}>
          <Icon name="map-marker" size={14} color={colors.textSecondary} />
          <Text style={styles.listAddress} numberOfLines={1}>
            {shortenAddress(address)}
          </Text>
        </View>

        <View style={styles.listMeta}>
          <Icon name="vector-square" size={14} color={colors.textSecondary} />
          <Text style={styles.listArea}>{formatArea(exclusiveArea)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // 그리드 스타일
  gridContainer: {
    width: CARD_WIDTH,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.base,
    ...shadows.sm,
  },
  gridImageContainer: {
    width: '100%',
    height: CARD_WIDTH * 0.75,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridInfo: {
    padding: spacing.sm,
  },
  gridPrice: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  gridTitle: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  gridAddress: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  gridArea: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // 리스트 스타일
  listContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.base,
    padding: spacing.sm,
    ...shadows.sm,
  },
  listImageContainer: {
    width: 120,
    height: 100,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  listImage: {
    width: '100%',
    height: '100%',
  },
  listInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listPrice: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  listTitle: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  listMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  listAddress: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    flex: 1,
  },
  listArea: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },

  // 공통 스타일
  categoryBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  categoryText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.textWhite,
  },
  likeButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dealTypeBadge: {
    backgroundColor: colors.backgroundBlue,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  dealTypeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.primary,
  },
});

export default PropertyCard;
