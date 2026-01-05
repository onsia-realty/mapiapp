/**
 * 검색바 컴포넌트
 * @description 홈 화면 상단 검색 입력 필드
 */

import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, fontSize, borderRadius, spacing, shadows } from '../../utils/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch?: () => void;
  onFocus?: () => void;
  placeholder?: string;
  editable?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onSearch,
  onFocus,
  placeholder = '지역, 단지명, 매물 검색',
  editable = true,
}) => {
  return (
    <View style={styles.container}>
      {/* 검색 아이콘 */}
      <Icon
        name="magnify"
        size={22}
        color={colors.textLight}
        style={styles.searchIcon}
      />

      {/* 검색 입력 필드 */}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textLight}
        returnKeyType="search"
        onSubmitEditing={onSearch}
        onFocus={onFocus}
        editable={editable}
      />

      {/* 검색어 초기화 버튼 */}
      {value.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => onChangeText('')}
        >
          <Icon name="close-circle" size={18} color={colors.textLight} />
        </TouchableOpacity>
      )}

      {/* 검색 버튼 */}
      <TouchableOpacity style={styles.searchButton} onPress={onSearch}>
        <Icon name="magnify" size={24} color={colors.textWhite} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.base,
    marginVertical: spacing.sm,
    ...shadows.md,
  },
  searchIcon: {
    marginLeft: spacing.base,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: spacing.sm,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  clearButton: {
    padding: spacing.sm,
  },
  searchButton: {
    width: 44,
    height: 44,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 2,
  },
});

export default SearchBar;
