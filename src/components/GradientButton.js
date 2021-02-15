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

const GradientButton = (props) => {
  return (
    <View style={{top: 10}}>
      <TouchableOpacity {...props} style={{marginBottom: 10}}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          colors={[theme.gradient.blue, theme.gradient.blue]}
          style={styles.buttonGradient}>
          {props.icon ? (
            <View style={styles.buttonWrapper}>
              <Icon
                name={props.iconName}
                color={props.iconColor}
                type={props.iconType}
                style={{paddingRight: 10}}
                size={props.iconSize}
              />
              <Text style={styles.footerButtonText}>{props.title}</Text>
            </View>
          ) : (
            <Text style={styles.footerButtonText}>{props.title}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};
export default GradientButton;

const styles = StyleSheet.create({
  buttonGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    height: 40,
  },
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: 200,
  },
  footerButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: theme.font.regular,
    textTransform: 'uppercase',
    paddingHorizontal: 20,
    paddingTop: 4,
  },
});
