import React, {useEffect, useState} from 'react';
import {StyleSheet, Image, Button} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import SearchReceiptScreen from './src/screens/SearchReceiptScreen';
import AddReceiptScreen from './src/screens/AddReceiptScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import LoginScreen from './src/screens/LoginScreen';
import AsyncStorage from '@react-native-community/async-storage';
import theme from './src/theme';
import {connect} from 'react-redux';
import {init} from './src/api/config';
init();

const Stack = createStackNavigator();
const App = (props) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LoadingScreen"
        screenOptions={{
          headerStyle: {backgroundColor: props.color},
          headerTitleAlign: 'center',
          headerTitleStyle: {color: 'white', fontFamily: theme.font.regular},
          headerTintColor: 'white',
          headerBackTitleVisible: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
        headerMode="float"
        animation="fade">
        <Stack.Screen
          name="LoadingScreen"
          component={LoadingScreen}
          options={{headerShown: false, gestureEnabled: false}}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{headerShown: false, gestureEnabled: false}}
        />
        <Stack.Screen
          name="AddReceiptScreen"
          component={AddReceiptScreen}
          options={{
            title: 'Add receipt',
          }}
        />
        <Stack.Screen
          name="SearchReceiptScreen"
          component={SearchReceiptScreen}
          options={{
            title: 'Search receipt',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
const mapStatetoProps = (state) => {
  return {
    color:
      state.user.userInfo != null
        ? state.user.userInfo.location.theme.color
        : 'grey',
  };
};
export default connect(mapStatetoProps)(App);

const styles = StyleSheet.create({});
