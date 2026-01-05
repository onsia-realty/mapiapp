/**
 * 공통 입력 필드 컴포넌트
 * @description 다양한 스타일의 재사용 가능한 입력 필드
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, fontSize, borderRadius, spacing, screenSize } from '../../utils/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  required = false,
  secureTextEntry,
  ...textInputProps
}) => {
  // 포커스 상태 관리
  const [isFocused, setIsFocused] = useState(false);
  // 비밀번호 보이기/숨기기 상태
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // 입력 필드 테두리 색상 결정
  const getBorderColor = () => {
    if (error) return colors.error;
    if (isFocused) return colors.primary;
    return colors.border;
  };

  // 비밀번호 토글 아이콘 처리
  const isPasswordField = secureTextEntry !== undefined;
  const effectiveSecureTextEntry = isPasswordField ? !isPasswordVisible : false;
  const passwordIcon = isPasswordVisible ? 'eye-off' : 'eye';

  return (
    <View style={[styles.container, containerStyle]}>
      {/* 라벨 */}
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.required}>*</Text>}
        </View>
      )}

      {/* 입력 필드 */}
      <View style={[styles.inputContainer, { borderColor: getBorderColor() }]}>
        {/* 왼쪽 아이콘 */}
        {leftIcon && (
          <Icon
            name={leftIcon}
            size={20}
            color={isFocused ? colors.primary : colors.textLight}
            style={styles.leftIcon}
          />
        )}

        {/* 텍스트 입력 */}
        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || isPasswordField) && styles.inputWithRightIcon,
          ]}
          placeholderTextColor={colors.textLight}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={effectiveSecureTextEntry}
          {...textInputProps}
        />

        {/* 오른쪽 아이콘 (비밀번호 토글 또는 커스텀) */}
        {(rightIcon || isPasswordField) && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={() => {
              if (isPasswordField) {
                setIsPasswordVisible(!isPasswordVisible);
              } else if (onRightIconPress) {
                onRightIconPress();
              }
            }}
          >
            <Icon
              name={isPasswordField ? passwordIcon : rightIcon!}
              size={20}
              color={colors.textLight}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* 에러 메시지 */}
      {error && (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={14} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* 도움말 텍스트 */}
      {helperText && !error && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  required: {
    fontSize: fontSize.md,
    color: colors.error,
    marginLeft: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: screenSize.inputHeight,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: spacing.base,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  leftIcon: {
    paddingLeft: spacing.base,
    paddingRight: spacing.sm,
  },
  rightIcon: {
    padding: spacing.base,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: 4,
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colors.error,
  },
  helperText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});

export default Input;
