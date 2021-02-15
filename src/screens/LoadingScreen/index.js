import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import theme from '../../theme';

const LoadingScreen = ({navigation}) => {
  const [auth, setAuth] = useState(false);
  useEffect(() => {
    checkUserToken();
  }, []);
  const checkUserToken = async () => {
    try {
      let token = await AsyncStorage.getItem('token');
      if (token == null) {
        navigation.navigate('LoginScreen');
      } else {
        navigation.navigate('HomeScreen');
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      <ActivityIndicator color="purple" />
    </View>
  );
};
export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.background.white,
  },
});
