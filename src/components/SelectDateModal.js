import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {Input, Icon, SearchBar, ListItem} from 'react-native-elements';
import theme from '../theme';
import CalendarPicker from 'react-native-calendar-picker';

const SelectDateModal = (props) => {
  const [selected, setSelected] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const selectDate = () => {
    if (selected) {
      props.setmodal(false);
      props.setDate(selected);
    } else {
      setErrorMessage('Choose Date');
    }
  };
  return (
    <Modal
      animationType="slide"
      style={styles.container}
      isVisible={props.dateModal}>
      <View style={[styles.header, {backgroundColor: props.color}]}>
        <Icon name="calendar-outline" color="white" type="ionicon" size={30} />
        <Text style={styles.centerText}>Select date</Text>
        <TouchableOpacity
          style={styles.headerWrapper}
          onPress={() => {
            props.setmodal(false);
          }}>
          <Icon name="close" color="white" type="ionicon" size={34} />
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.wrapper}>
        <CalendarPicker
          width={400}
          height={400}
          startFromMonday={true}
          todayBackgroundColor="white"
          selectedDayTextColor="white"
          todayTextStyle={{}}
          selectedDayStyle={{
            backgroundColor: props.color,
          }}
          textStyle={{fontFamily: theme.font.regular}}
          onDateChange={(value) => setSelected(new Date(value))}
          previousComponent={
            <Icon
              name="chevron-left"
              type="evilicon"
              size={25}
              style={{paddingRight: 10}}
            />
          }
          nextComponent={
            <Icon
              name="chevron-right"
              type="evilicon"
              size={25}
              style={{paddingRight: 10}}
            />
          }
          dayShape="square"
          allowBackwardRangeSelect={true}
        />
      </View>
      <View style={styles.footerButtonWrapper}>
        <Text style={styles.errorMessage}>{errorMessage}</Text>
        <TouchableOpacity
          onPress={() => selectDate()}
          style={[styles.footerButton, {backgroundColor: props.color}]}>
          <Text style={styles.footerButtonText}>Select Date</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
export default SelectDateModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingTop: Platform.OS == 'ios' ? 40 : 0,
  },
  header: {
    width: '100%',
    height: Platform.OS == 'ios' ? 90 : 66,
    paddingTop: Platform.OS == 'ios' ? 30 : null,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerText: {
    color: 'white',
    fontSize: 20,
    fontFamily: theme.font.regular,
  },
  closeText: {
    color: 'white',
    fontFamily: theme.font.regular,
  },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginBottom: 60,
  },
  footerButtonWrapper: {
    position: 'absolute',
    bottom: Platform.OS == 'ios' ? 40 : 20,
    right: 0,
    left: 0,
  },
  footerButton: {
    height: 50,
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  errorMessage: {
    color: theme.background.red,
    alignSelf: 'center',
    fontFamily: theme.font.regular,
  },
  footerButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: theme.font.regular,
    textTransform: 'uppercase',
  },
});
