/**
 * 카테고리 그리드 컴포넌트
 * @description 홈 화면에서 매물 카테고리를 선택하는 그리드
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { PropertyCategory } from '../../types';
import { colors, fontSize, fontWeight, borderRadius, spacing, shadows, categoryConfig } from '../../utils/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = (SCREEN_WIDTH - spacing.base * 2 - spacing.sm * 2) / 3;

// 카테고리 항목 타입
interface CategoryItem {
  key: PropertyCategory;
  label: string;
  icon: string;
  color: string;
}

// 카테고리 목록
const categories: CategoryItem[] = [
  {
    key: 'presale',
    label: '분양권\n전매',
    icon: 'home-city',
    color: colors.categoryPresale,
  },
  {
    key: 'interestOnly',
    label: '이자만',
    icon: 'percent',
    color: colors.categoryInterest,
  },
  {
    key: 'profitable',
    label: '수익형\n부동산',
    icon: 'chart-line',
    color: colors.categoryProfitable,
  },
  {
    key: 'office',
    label: '사무실',
    icon: 'office-building',
    color: colors.categoryOffice,
  },
  {
    key: 'apartment',
    label: '아파트',
    icon: 'home-modern',
    color: colors.categoryApartment,
  },
  {
    key: 'job',
    label: '구인구직',
    icon: 'briefcase',
    color: colors.categoryJob,
  },
];

interface CategoryGridProps {
  onCategoryPress: (category: PropertyCategory) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ onCategoryPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>매물 찾기</Text>

      <View style={styles.grid}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.key}
            style={styles.item}
            onPress={() => onCategoryPress(category.key)}
            activeOpacity={0.7}
          >
            {/* 아이콘 원형 배경 */}
            <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
              <Icon name={category.icon} size={28} color={colors.textWhite} />
            </View>

            {/* 카테고리 이름 */}
            <Text style={styles.label}>{category.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.base,
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.base,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  item: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default CategoryGrid;
