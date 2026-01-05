/**
 * 로그인 화면
 * @description 일반회원/중개사 탭 전환, 소셜 로그인 지원
 * @reference PDF 요구사항 6페이지 (A01 로그인)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Input } from '../../components';
import { RootStackParamList, UserType, SocialProvider } from '../../types';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '../../utils/theme';
import { isValidEmail } from '../../utils/helpers';

type LoginNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginNavigationProp>();

  // 상태 관리
  const [userType, setUserType] = useState<UserType>('general');  // 일반회원/중개사 탭
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // 입력값 검증
  const validateInputs = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!isValidEmail(email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }

    if (!password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 일반 로그인 처리
  const handleLogin = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      // TODO: 실제 로그인 API 호출
      // const response = await authService.login({ email, password, userType });

      // 임시: 로그인 성공 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 메인 화면으로 이동
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (error) {
      Alert.alert('로그인 실패', '이메일 또는 비밀번호를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // 소셜 로그인 처리
  const handleSocialLogin = async (provider: SocialProvider) => {
    try {
      // TODO: 각 소셜 로그인 SDK 연동
      // const response = await authService.socialLogin(provider);

      Alert.alert('안내', `${provider} 로그인 기능은 준비 중입니다.`);
    } catch (error) {
      Alert.alert('오류', '소셜 로그인에 실패했습니다.');
    }
  };

  // 회원가입 화면으로 이동
  const handleSignUp = () => {
    // TODO: SignUpScreen으로 이동
    Alert.alert('안내', '회원가입 화면으로 이동합니다.');
  };

  // 비밀번호 찾기
  const handleFindPassword = () => {
    // TODO: FindPasswordScreen으로 이동
    Alert.alert('안내', '비밀번호 찾기 화면으로 이동합니다.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* 로고 영역 */}
          <View style={styles.logoContainer}>
            {/* TODO: 실제 로고 이미지로 교체 */}
            <View style={styles.logoPlaceholder}>
              <Icon name="home-city" size={48} color={colors.primary} />
              <Text style={styles.logoText}>온시아</Text>
            </View>
            <Text style={styles.tagline}>부동산의 새로운 기준</Text>
          </View>

          {/* 탭 영역 (일반회원 / 중개사) */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                userType === 'general' && styles.tabActive,
              ]}
              onPress={() => setUserType('general')}
            >
              <Text
                style={[
                  styles.tabText,
                  userType === 'general' && styles.tabTextActive,
                ]}
              >
                일반회원
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                userType === 'broker' && styles.tabActive,
              ]}
              onPress={() => setUserType('broker')}
            >
              <Text
                style={[
                  styles.tabText,
                  userType === 'broker' && styles.tabTextActive,
                ]}
              >
                중개사
              </Text>
            </TouchableOpacity>
          </View>

          {/* 로그인 폼 */}
          <View style={styles.formContainer}>
            {/* 이메일 입력 */}
            <Input
              label="이메일"
              placeholder="이메일을 입력하세요"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="email-outline"
              error={errors.email}
            />

            {/* 비밀번호 입력 */}
            <Input
              label="비밀번호"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              secureTextEntry
              leftIcon="lock-outline"
              error={errors.password}
            />

            {/* 자동 로그인 / 비밀번호 찾기 */}
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setAutoLogin(!autoLogin)}
              >
                <Icon
                  name={autoLogin ? 'checkbox-marked' : 'checkbox-blank-outline'}
                  size={22}
                  color={autoLogin ? colors.primary : colors.textLight}
                />
                <Text style={styles.checkboxLabel}>자동 로그인</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleFindPassword}>
                <Text style={styles.findPasswordText}>비밀번호 찾기</Text>
              </TouchableOpacity>
            </View>

            {/* 로그인 버튼 */}
            <Button
              title="로그인"
              onPress={handleLogin}
              size="full"
              loading={isLoading}
              style={styles.loginButton}
            />

            {/* 회원가입 */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>아직 회원이 아니신가요?</Text>
              <TouchableOpacity onPress={handleSignUp}>
                <Text style={styles.signUpLink}>회원가입</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 소셜 로그인 구분선 */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>간편 로그인</Text>
            <View style={styles.divider} />
          </View>

          {/* 소셜 로그인 버튼들 */}
          <View style={styles.socialContainer}>
            {/* 카카오 로그인 */}
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: colors.kakao }]}
              onPress={() => handleSocialLogin('kakao')}
            >
              <Icon name="chat" size={24} color="#3C1E1E" />
            </TouchableOpacity>

            {/* 네이버 로그인 */}
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: colors.naver }]}
              onPress={() => handleSocialLogin('naver')}
            >
              <Text style={styles.naverText}>N</Text>
            </TouchableOpacity>

            {/* 구글 로그인 */}
            <TouchableOpacity
              style={[styles.socialButton, styles.googleButton]}
              onPress={() => handleSocialLogin('google')}
            >
              <Icon name="google" size={24} color={colors.textPrimary} />
            </TouchableOpacity>

            {/* 애플 로그인 (iOS only) */}
            {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: colors.apple }]}
                onPress={() => handleSocialLogin('apple')}
              >
                <Icon name="apple" size={24} color={colors.textWhite} />
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing['2xl'],
  },

  // 로고 영역
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  logoPlaceholder: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginTop: spacing.sm,
  },
  tagline: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },

  // 탭 영역
  tabContainer: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.backgroundGray,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  tabActive: {
    backgroundColor: colors.background,
  },
  tabText: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },

  // 폼 영역
  formContainer: {
    marginBottom: spacing.xl,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  checkboxLabel: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  findPasswordText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
  loginButton: {
    marginTop: spacing.sm,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  signUpText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  signUpLink: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },

  // 소셜 로그인 구분선
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: spacing.base,
    fontSize: fontSize.sm,
    color: colors.textLight,
  },

  // 소셜 로그인 버튼
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.base,
  },
  socialButton: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButton: {
    backgroundColor: colors.google,
    borderWidth: 1,
    borderColor: colors.border,
  },
  naverText: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textWhite,
  },
});

export default LoginScreen;
