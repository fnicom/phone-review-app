import { Tabs, useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AuthGuard from '../AuthGuard';
import { auth } from '../config/firebase';

export default function TabLayout({ children }) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/auth');
  };

  return (
    <AuthGuard>
      <View style={styles.container}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: '#6C47FF',
            tabBarInactiveTintColor: '#B0B0B0',
            headerShown: true,
            tabBarStyle: styles.tabBar,
            headerStyle: styles.header,
            headerTintColor: '#FFF',
            headerTitleStyle: { fontFamily: 'Inter_700Bold', color: '#FFF', fontSize: 20 },
            tabBarShowLabel: false,
            headerRight: () => (
              <TouchableOpacity onPress={handleLogout} style={{ marginRight: 16 }}>
                <Text style={{ color: '#FF9800', fontWeight: 'bold', fontSize: 16, fontFamily: 'Inter_700Bold' }}>Sair</Text>
              </TouchableOpacity>
            ),
          }}>
          <Tabs.Screen
            name="index"
            options={{
              tabBarIcon: () => (
                <Image
                  source={require('../../assets/icons/home.png')}
                  style={{ width: 24, height: 24 }}
                  resizeMode="contain"
                />
              ),
            }}
          />
          <Tabs.Screen
            name="add-review"
            options={{
              tabBarIcon: () => (
                <Image
                  source={require('../../assets/icons/star.png')}
                  style={{ width: 24, height: 24 }}
                  resizeMode="contain"
                />
              ),
            }}
          />
          <Tabs.Screen
            name="buscar"
            options={{
              tabBarIcon: () => (
                <Image
                  source={require('../../assets/icons/search.png')}
                  style={{ width: 24, height: 24 }}
                  resizeMode="contain"
                />
              ),
            }}
          />
          <Tabs.Screen
            name="reviews"
            options={{
              tabBarIcon: () => (
                <Image
                  source={require('../../assets/icons/book.png')}
                  style={{ width: 24, height: 24 }}
                  resizeMode="contain"
                />
              ),
            }}
          />
        </Tabs>
        {children}
      </View>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  tabBar: {
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 0,
    shadowOpacity: 0,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  header: {
    backgroundColor: '#6C47FF',
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitle: {
    fontWeight: 'bold',
    fontFamily: 'Inter_700Bold',
    color: '#FFF',
    fontSize: 20,
  },
});
