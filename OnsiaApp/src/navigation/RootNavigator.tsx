/**
 * 루트 네비게이터
 * @description 앱 전체 네비게이션 구조 정의
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList, BottomTabParamList } from '../types';
import { colors, fontSize, fontWeight } from '../utils/theme';

// 화면 컴포넌트 import
import {
  LoginScreen,
  HomeScreen,
  MapScreen,
  DetailScreen,
} from '../screens';

// 임시 화면 컴포넌트 (추후 구현)
import { View, Text, StyleSheet } from 'react-native';

// 임시 화면들
const FavoritesScreen = () => (
  <View style={tempStyles.container}>
    <Icon name="heart-outline" size={64} color={colors.textLight} />
    <Text style={tempStyles.text}>관심목록</Text>
    <Text style={tempStyles.subText}>찜한 매물이 여기에 표시됩니다</Text>
  </View>
);

const PropertyRegisterScreen = () => (
  <View style={tempStyles.container}>
    <Icon name="plus-circle-outline" size={64} color={colors.textLight} />
    <Text style={tempStyles.text}>매물등록</Text>
    <Text style={tempStyles.subText}>새 매물을 등록하세요</Text>
  </View>
);

const JobScreen = () => (
  <View style={tempStyles.container}>
    <Icon name="briefcase-outline" size={64} color={colors.textLight} />
    <Text style={tempStyles.text}>구인구직</Text>
    <Text style={tempStyles.subText}>부동산 업계 일자리</Text>
  </View>
);

const MyPageScreen = () => (
  <View style={tempStyles.container}>
    <Icon name="account-circle-outline" size={64} color={colors.textLight} />
    <Text style={tempStyles.text}>더보기</Text>
    <Text style={tempStyles.subText}>내 정보 및 설정</Text>
  </View>
);

const SearchScreen = () => (
  <View style={tempStyles.container}>
    <Icon name="magnify" size={64} color={colors.textLight} />
    <Text style={tempStyles.text}>검색</Text>
    <Text style={tempStyles.subText}>매물 검색 화면</Text>
  </View>
);

const FilterScreen = () => (
  <View style={tempStyles.container}>
    <Icon name="filter-variant" size={64} color={colors.textLight} />
    <Text style={tempStyles.text}>필터</Text>
    <Text style={tempStyles.subText}>카테고리별 매물 목록</Text>
  </View>
);

const tempStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundGray,
    gap: 8,
  },
  text: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  subText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
});

// 스택 네비게이터 생성
const Stack = createNativeStackNavigator<RootStackParamList>();

// 바텀탭 네비게이터 생성
const Tab = createBottomTabNavigator<BottomTabParamList>();

/**
 * 바텀탭 네비게이터 컴포넌트
 * @description 메인 화면 하단 탭 네비게이션
 */
const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarLabelStyle: {
          fontSize: fontSize.xs,
          fontWeight: fontWeight.medium,
        },
        tabBarStyle: {
          height: 60,
          paddingTop: 8,
          paddingBottom: 8,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Favorites':
              iconName = focused ? 'heart' : 'heart-outline';
              break;
            case 'PropertyRegister':
              iconName = focused ? 'plus-circle' : 'plus-circle-outline';
              break;
            case 'Job':
              iconName = focused ? 'briefcase' : 'briefcase-outline';
              break;
            case 'MyPage':
              iconName = focused ? 'account-circle' : 'account-circle-outline';
              break;
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: '홈' }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ tabBarLabel: '관심목록' }}
      />
      <Tab.Screen
        name="PropertyRegister"
        component={PropertyRegisterScreen}
        options={{ tabBarLabel: '매물등록' }}
      />
      <Tab.Screen
        name="Job"
        component={JobScreen}
        options={{ tabBarLabel: '구인구직' }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{ tabBarLabel: '더보기' }}
      />
    </Tab.Navigator>
  );
};

/**
 * 루트 스택 네비게이터
 * @description 앱 전체 네비게이션 구조
 */
const RootNavigator: React.FC = () => {
  // TODO: 로그인 상태 확인
  const isLoggedIn = true; // 임시로 true 설정 (로그인 화면 건너뛰기)

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
      initialRouteName={isLoggedIn ? 'Main' : 'Auth'}
    >
      {/* 인증 화면 */}
      <Stack.Screen name="Auth" component={LoginScreen} />

      {/* 메인 화면 (바텀탭) */}
      <Stack.Screen name="Main" component={BottomTabNavigator} />

      {/* 매물 상세 화면 */}
      <Stack.Screen
        name="PropertyDetail"
        component={DetailScreen}
        options={{
          animation: 'slide_from_bottom',
        }}
      />

      {/* 검색 화면 */}
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          animation: 'fade',
        }}
      />

      {/* 필터/카테고리 화면 */}
      <Stack.Screen
        name="Filter"
        component={MapScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
