/**
 * 공통 버튼 컴포넌트
 * @description 다양한 스타일의 재사용 가능한 버튼
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, fontSize, fontWeight, borderRadius, screenSize } from '../../utils/theme';

// 버튼 변형 타입
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'kakao' | 'naver' | 'google' | 'apple';

// 버튼 크기 타입
type ButtonSize = 'sm' | 'md' | 'lg' | 'full';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
}) => {
  // 버튼 스타일 결정
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.base,
      ...getSizeStyle(),
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? colors.border : colors.primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? colors.border : colors.backgroundBlue,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: disabled ? colors.border : colors.primary,
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      case 'kakao':
        return {
          ...baseStyle,
          backgroundColor: colors.kakao,
        };
      case 'naver':
        return {
          ...baseStyle,
          backgroundColor: colors.naver,
        };
      case 'google':
        return {
          ...baseStyle,
          backgroundColor: colors.google,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'apple':
        return {
          ...baseStyle,
          backgroundColor: colors.apple,
        };
      default:
        return baseStyle;
    }
  };

  // 크기별 스타일
  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return { height: 36, paddingHorizontal: 12 };
      case 'md':
        return { height: 44, paddingHorizontal: 16 };
      case 'lg':
        return { height: screenSize.buttonHeight, paddingHorizontal: 20 };
      case 'full':
        return { height: screenSize.buttonHeight, width: '100%' };
      default:
        return { height: 44, paddingHorizontal: 16 };
    }
  };

  // 텍스트 스타일 결정
  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case 'primary':
        return { color: colors.textWhite };
      case 'secondary':
        return { color: colors.primary };
      case 'outline':
        return { color: disabled ? colors.textLight : colors.primary };
      case 'ghost':
        return { color: colors.primary };
      case 'kakao':
        return { color: '#3C1E1E' };
      case 'naver':
        return { color: colors.textWhite };
      case 'google':
        return { color: colors.textPrimary };
      case 'apple':
        return { color: colors.textWhite };
      default:
        return { color: colors.textWhite };
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.textWhite}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text style={[styles.text, getTextStyle(), textStyle]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    gap: 8,
  },
  text: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
});

export default Button;
