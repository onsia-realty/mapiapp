/**
 * 공통 헤더 컴포넌트
 * @description 화면 상단 네비게이션 헤더
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, fontSize, fontWeight, spacing, screenSize } from '../../utils/theme';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightIcon?: string;
  rightText?: string;
  onRightPress?: () => void;
  transparent?: boolean;
  centerComponent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBackPress,
  rightIcon,
  rightText,
  onRightPress,
  transparent = false,
  centerComponent,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          backgroundColor: transparent ? 'transparent' : colors.background,
        },
      ]}
    >
      <StatusBar
        barStyle={transparent ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      <View style={styles.content}>
        {/* 왼쪽 영역 (뒤로가기 버튼) */}
        <View style={styles.leftContainer}>
          {showBack && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onBackPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon
                name="chevron-left"
                size={28}
                color={transparent ? colors.textWhite : colors.textPrimary}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* 중앙 영역 (타이틀 또는 커스텀 컴포넌트) */}
        <View style={styles.centerContainer}>
          {centerComponent ? (
            centerComponent
          ) : (
            <Text
              style={[
                styles.title,
                { color: transparent ? colors.textWhite : colors.textPrimary },
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>
          )}
        </View>

        {/* 오른쪽 영역 */}
        <View style={styles.rightContainer}>
          {(rightIcon || rightText) && (
            <TouchableOpacity
              style={styles.rightButton}
              onPress={onRightPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              {rightIcon && (
                <Icon
                  name={rightIcon}
                  size={24}
                  color={transparent ? colors.textWhite : colors.textPrimary}
                />
              )}
              {rightText && (
                <Text
                  style={[
                    styles.rightText,
                    { color: transparent ? colors.textWhite : colors.primary },
                  ]}
                >
                  {rightText}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: screenSize.headerHeight,
    paddingHorizontal: spacing.base,
  },
  leftContainer: {
    width: 48,
    alignItems: 'flex-start',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rightContainer: {
    width: 48,
    alignItems: 'flex-end',
  },
  iconButton: {
    padding: spacing.xs,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  rightButton: {
    padding: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rightText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },
});

export default Header;
