import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import theme from '../../theme';
import {Input, Icon} from 'react-native-elements';
import logo from '../../assets/images/black-white-logo.jpg';
import {TouchableOpacity, ScrollView} from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import AuthApi from '../../api/auth';
import {useForm} from 'react-hook-form';
import GradientButton from '../../components/GradientButton';
const LoginScreen = ({navigation}) => {
  const [fetching, setFetching] = useState(false);
  const {handleSubmit} = useForm();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorEmail, setErrorEmail] = useState(null);
  const [errorPassword, setErrorPassword] = useState(null);
  const onHandleEmail = (value) => {
    if (value == '') {
      setErrorEmail('Required');
    } else {
      setErrorEmail('');
      setEmail(value);
    }
  };
  const onHandlePassword = (value) => {
    if (value == '') {
      setErrorPassword('Required');
    } else {
      setErrorPassword('');
      setPassword(value);
    }
  };

  const onLogin = async () => {
    if (errorEmail == '' && errorPassword == '') {
      setFetching(true);
      try {
        AuthApi.login({username: email, password: password}).then((res) => {
          if (res.status == 200) {
            saveOnStorage(res.headers.authorization);
            navigation.replace('HomeScreen', {
              token: res.headers.authorization,
            });
            setFetching(false);
          } else {
            setErrorEmail('Correct email or password required');
            setFetching(false);
          }
        });
      } catch (error) {
        setErrorEmail('Please check your internet connection');
        console.warn(error);
      }
    } else {
      onHandleEmail(email);
      onHandlePassword(password);
    }
  };
  const saveOnStorage = async (token) => {
    try {
      await AsyncStorage.setItem('token', token);
    } catch (error) {
      console.log(error);
    }
  };
  const [passIcon, setPassIcon] = useState(true);
  // navigation.replace('HomeScreen')
  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Spinner visible={fetching} />
          <Image source={logo} style={styles.logo} />
          <View style={styles.loginWrapper}>
            <Text style={styles.loginText}>Login</Text>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={[theme.gradient.blue, theme.gradient.blue]}
              style={styles.loginGradient}></LinearGradient>
          </View>
        </View>
        <View style={styles.footer}>
          <Input
            name="Email"
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.inputText}
            placeholder="Username"
            placeholderTextColor={theme.input.placeholder}
            rightIcon={{
              type: 'font-awesome',
              name: 'eye',
              color: 'transparent',
            }} // for size of input
            onChangeText={(value) => onHandleEmail(value)}
          />
          <Text
            style={{
              fontSize: 14,
              color: '#ff0000',
              marginLeft: 30,
              marginTop: -20,
              fontFamily: theme.font.regular,
            }}>
            {errorEmail != null ? errorEmail : ''}
          </Text>

          <Input
            name="Password"
            secureTextEntry={passIcon}
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.inputText}
            placeholder="Password"
            placeholderTextColor={theme.input.placeholder}
            rightIcon={
              <Icon
                name={passIcon ? 'eye' : 'eye-slash'}
                color="#CCCCCC"
                type="font-awesome"
                onPress={() => setPassIcon(!passIcon)}
              />
            }
            onChangeText={(value) => onHandlePassword(value)}
          />
          <Text
            style={{
              fontSize: 14,
              color: '#ff0000',
              marginLeft: 30,
              marginTop: -20,
              fontFamily: theme.font.regular,
            }}>
            {errorPassword != null ? errorPassword : ''}
          </Text>

          <View
            style={{
              paddingHorizontal: 30,
            }}>
            <GradientButton
              title="login"
              icon={false}
              onPress={handleSubmit(onLogin)}
            />
          </View>
          <View style={styles.bottomLine}></View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.background.white,
    flex: 1,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    height: '50%',
    alignItems: 'center',
    paddingVertical: 40,
    position: 'absolute',
    justifyContent: 'center',
  },
  loginWrapper: {
    width: '50%',
    marginHorizontal: 20,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 24,
    margin: 28,
    fontFamily: theme.font.bold,
    color: theme.gradient.blue,
  },
  loginGradient: {
    height: 7,
    width: '100%',
  },
  buttonGradient: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  footer: {
    bottom: 40,
    position: 'absolute',
    width: '100%',
    maxWidth: 500,
    justifyContent: 'center',
    backgroundColor: 'white',
    height: '50%',
  },
  inputContainer: {
    paddingHorizontal: 10,
    marginHorizontal: 20,
    borderColor: '#1F54C326',
    borderWidth: 0.5,
    borderRadius: 5,
  },
  inputText: {
    color: theme.input.color,
    fontFamily: theme.font.regular,
  },
  bottomLine: {
    borderWidth: 0.5,
    borderColor: '#4E54C8',
    marginHorizontal: 30,
    marginTop: 20,
    opacity: 0.2,
  },
  logo: {
    height: 100,
    width: 340,
    resizeMode: 'stretch',
    marginVertical: 20,
  },
});
