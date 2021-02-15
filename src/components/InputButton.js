import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  FlatList,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {Header, Icon, Input, ListItem} from 'react-native-elements';
import theme from '../theme';
import LinearGradient from 'react-native-linear-gradient';

const InputButton = (props) => {
  return (
    <TouchableOpacity {...props} style={styles.inputWrapper}>
      <Text
        style={[
          styles.buttonText,
          {
            color: props.titleColor,
          },
        ]}>
        {props.title}
      </Text>
      {props.icon ? (
        <Icon
          name={props.iconName}
          color={props.iconColor}
          type={props.iconType}
        />
      ) : null}
    </TouchableOpacity>
  );
};
export default InputButton;

const styles = StyleSheet.create({
  inputWrapper: {
    alignSelf: 'center',
    height: 50,
    marginBottom: 20,
    borderColor: theme.gradient.blue,
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    maxWidth: 500,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: theme.font.regular,
  },
});
