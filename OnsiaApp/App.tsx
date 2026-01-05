/**
 * 온시아 (Onsia) 부동산 앱
 * @description 앱 엔트리 포인트
 * @version 1.0.0 (MVP)
 */

import React from 'react';
import { StatusBar, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation';

// 개발 중 경고 무시 (프로덕션에서는 제거)
LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
]);

/**
 * 앱 루트 컴포넌트
 */
const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {/* 상태바 설정 */}
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />

        {/* 루트 네비게이터 */}
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
