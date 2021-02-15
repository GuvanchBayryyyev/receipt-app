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

const RemarkModal = (props) => {
  const [value, setValue] = useState(props.remark);
  const setRemark = () => {
    props.setRemark(value);
    props.setmodal(false);
  };
  return (
    <Modal
      style={styles.centeredView}
      animationType="slide"
      transparent={true}
      onBackdropPress={() => {
        alert('Hello');
      }}
      visible={props.remarkModal}>
      <KeyboardAvoidingView style={styles.centeredView} behavior="padding">
        <View style={styles.modalView}>
          <Input
            placeholder="Type remark..."
            value={value}
            multiline={true}
            numberOfLines={3}
            containerStyle={[styles.inputWrapper, {height: 100}]}
            inputContainerStyle={{borderColor: 'transparent'}}
            inputStyle={{fontFamily: theme.font.regular}}
            placeholderTextColor={theme.input.placeholder}
            onChangeText={(value) => {
              setValue(value);
            }}
            rightIcon={
              <Icon
                name="close"
                color="grey"
                type="ionicon"
                size={24}
                onPress={() => {
                  setValue('');
                }}
              />
            }
            rightIconContainerStyle={{
              paddingLeft: 10,
            }}
          />
          <View style={styles.footerButtonWrapper}>
            <TouchableOpacity
              onPress={() => props.setmodal(false)}
              style={styles.footerButtonCancel}>
              <Text style={styles.footerButtonTextCancel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setRemark()}
              style={[styles.footerButton, {backgroundColor: props.color}]}>
              <Text style={styles.footerButtonText}>Set Remark</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
export default RemarkModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(100,100,100, 0.7)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxWidth: 600,
  },
  inputWrapper: {
    height: 50,
    marginBottom: 20,
    borderColor: theme.gradient.blue,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  footerButtonWrapper: {
    display: 'flex',
    flexDirection: 'row',
  },
  footerButton: {
    height: 40,
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  footerButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: theme.font.regular,
    paddingHorizontal: 20,
  },
  footerButtonCancel: {
    height: 40,
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    borderColor: theme.background.red,
    borderWidth: 1,
  },
  footerButtonTextCancel: {
    color: theme.background.red,
    fontSize: 18,
    fontFamily: theme.font.regular,
    paddingHorizontal: 20,
  },
});
