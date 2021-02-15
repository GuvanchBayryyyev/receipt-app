import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import theme from '../theme';
import {connect} from 'react-redux';

const CustomButton = (props) => {
  return (
    <View style={{top: 10}}>
      <TouchableOpacity
        {...props}
        style={[styles.button, {backgroundColor: props.color}]}>
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
      </TouchableOpacity>
    </View>
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
export default connect(mapStatetoProps)(CustomButton);

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    height: 40,
    marginBottom: 10,
  },
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
