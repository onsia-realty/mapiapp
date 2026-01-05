/**
 * 필터 바텀시트 컴포넌트
 * @description 지도 화면에서 매물 필터링을 위한 바텀시트
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { PropertyFilter, DealType } from '../../types';
import { colors, fontSize, fontWeight, borderRadius, spacing, shadows } from '../../utils/theme';
import Button from '../common/Button';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filter: PropertyFilter) => void;
  initialFilter?: PropertyFilter;
}

// 거래 유형 옵션
const dealTypeOptions: { value: DealType | undefined; label: string }[] = [
  { value: undefined, label: '전체' },
  { value: 'sale', label: '매매' },
  { value: 'rent', label: '전세' },
  { value: 'monthly', label: '월세' },
];

// 가격 범위 옵션 (만원 단위)
const priceRangeOptions = [
  { min: 0, max: 5000, label: '5천만 이하' },
  { min: 5000, max: 10000, label: '5천~1억' },
  { min: 10000, max: 30000, label: '1~3억' },
  { min: 30000, max: 50000, label: '3~5억' },
  { min: 50000, max: 100000, label: '5~10억' },
  { min: 100000, max: undefined, label: '10억 이상' },
];

// 면적 범위 옵션 (㎡ 단위)
const areaRangeOptions = [
  { min: 0, max: 33, label: '10평 이하' },
  { min: 33, max: 66, label: '10~20평' },
  { min: 66, max: 99, label: '20~30평' },
  { min: 99, max: 132, label: '30~40평' },
  { min: 132, max: undefined, label: '40평 이상' },
];

const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({
  visible,
  onClose,
  onApply,
  initialFilter = {},
}) => {
  // 필터 상태
  const [filter, setFilter] = useState<PropertyFilter>(initialFilter);
  const [selectedPriceIndex, setSelectedPriceIndex] = useState<number | null>(null);
  const [selectedAreaIndex, setSelectedAreaIndex] = useState<number | null>(null);

  // 거래 유형 선택
  const handleDealTypeSelect = (dealType: DealType | undefined) => {
    setFilter({ ...filter, dealType });
  };

  // 가격 범위 선택
  const handlePriceSelect = (index: number) => {
    if (selectedPriceIndex === index) {
      setSelectedPriceIndex(null);
      setFilter({ ...filter, minPrice: undefined, maxPrice: undefined });
    } else {
      setSelectedPriceIndex(index);
      const range = priceRangeOptions[index];
      setFilter({ ...filter, minPrice: range.min, maxPrice: range.max });
    }
  };

  // 면적 범위 선택
  const handleAreaSelect = (index: number) => {
    if (selectedAreaIndex === index) {
      setSelectedAreaIndex(null);
      setFilter({ ...filter, minArea: undefined, maxArea: undefined });
    } else {
      setSelectedAreaIndex(index);
      const range = areaRangeOptions[index];
      setFilter({ ...filter, minArea: range.min, maxArea: range.max });
    }
  };

  // 필터 초기화
  const handleReset = () => {
    setFilter({});
    setSelectedPriceIndex(null);
    setSelectedAreaIndex(null);
  };

  // 필터 적용
  const handleApply = () => {
    onApply(filter);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />

        <View style={styles.container}>
          {/* 핸들 바 */}
          <View style={styles.handleBar} />

          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.title}>필터</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* 필터 내용 */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* 거래 유형 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>거래 유형</Text>
              <View style={styles.optionRow}>
                {dealTypeOptions.map((option) => (
                  <TouchableOpacity
                    key={option.label}
                    style={[
                      styles.optionButton,
                      filter.dealType === option.value && styles.optionButtonActive,
                    ]}
                    onPress={() => handleDealTypeSelect(option.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        filter.dealType === option.value && styles.optionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 가격 범위 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>가격</Text>
              <View style={styles.optionGrid}>
                {priceRangeOptions.map((option, index) => (
                  <TouchableOpacity
                    key={option.label}
                    style={[
                      styles.optionChip,
                      selectedPriceIndex === index && styles.optionChipActive,
                    ]}
                    onPress={() => handlePriceSelect(index)}
                  >
                    <Text
                      style={[
                        styles.optionChipText,
                        selectedPriceIndex === index && styles.optionChipTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 면적 범위 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>면적</Text>
              <View style={styles.optionGrid}>
                {areaRangeOptions.map((option, index) => (
                  <TouchableOpacity
                    key={option.label}
                    style={[
                      styles.optionChip,
                      selectedAreaIndex === index && styles.optionChipActive,
                    ]}
                    onPress={() => handleAreaSelect(index)}
                  >
                    <Text
                      style={[
                        styles.optionChipText,
                        selectedAreaIndex === index && styles.optionChipTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* 하단 버튼 */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Icon name="refresh" size={20} color={colors.textSecondary} />
              <Text style={styles.resetText}>초기화</Text>
            </TouchableOpacity>

            <Button
              title="매물 보기"
              onPress={handleApply}
              size="lg"
              style={styles.applyButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: SCREEN_HEIGHT * 0.8,
    ...shadows.lg,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    alignSelf: 'center',
    marginTop: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  content: {
    padding: spacing.base,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  optionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  optionButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  optionButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.backgroundBlue,
  },
  optionText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  optionTextActive: {
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  optionChip: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.full,
  },
  optionChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.backgroundBlue,
  },
  optionChipText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  optionChipTextActive: {
    color: colors.primary,
    fontWeight: fontWeight.medium,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    paddingBottom: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.base,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
  },
  resetText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  applyButton: {
    flex: 1,
  },
});

export default FilterBottomSheet;
