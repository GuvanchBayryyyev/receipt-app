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

const SelectSupplierModal = (props) => {
  const [searchValue, setSearchValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [dataSearchBar, setDataSearchBar] = useState(props.suppliers);
  const [selected, setSelected] = useState(null);
  const searchFilterFunction = (text) => {
    setSearchValue(text);
    const newData = props.suppliers.filter((item) => {
      const itemData = `${item.name.toLowerCase()}`;
      const textData = text.toLowerCase();
      return itemData.indexOf(textData) > -1;
    });
    setDataSearchBar(newData);
  };
  const renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '86%',
          marginLeft: '14%',
          backgroundColor: 'transparent',
        }}
      />
    );
  };
  const selectSupplier = () => {
    if (selected) {
      props.setmodal(false);
      props.setSupplier(selected);
    } else {
      setErrorMessage('Select supplier');
    }
  };
  return (
    <Modal
      animationType="slide"
      style={styles.container}
      isVisible={props.supplierModal}>
      <View style={[styles.header, {backgroundColor: props.color}]}>
        <Icon name="close" color="transparent" type="ionicon" size={40} />
        <Text style={styles.centerText}>Search supplier</Text>
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
        <SearchBar
          inputStyle={styles.inputText}
          clearIcon={true}
          searchIcon={false}
          containerStyle={styles.inputContainer}
          inputContainerStyle={{backgroundColor: 'transparent'}}
          inputStyle={{borderColor: 'green', fontFamily: theme.font.regular}}
          placeholder="Type to search"
          onChangeText={(value) => searchFilterFunction(value)}
          value={searchValue}
        />
        <FlatList
          showsVerticalScrollIndicator={false}
          style={styles.listWrapper}
          data={dataSearchBar}
          renderItem={({item}) => (
            <ListItem
              key={item.id}
              bottomDivider
              style={{
                borderBottomWidth: 1,
                borderColor: theme.input.color,
              }}
              onPress={() => setSelected({id: item.id, name: item.name})}>
              <ListItem.Title
                style={[
                  styles.listItemTitle,
                  {
                    color: selected
                      ? selected.id == item.id
                        ? props.color //'#E20F22'
                        : theme.gradient.blue
                      : theme.gradient.blue,
                    paddingLeft: selected
                      ? selected.id == item.id
                        ? 6
                        : 0
                      : 0,
                  },
                ]}>
                {item.name}
              </ListItem.Title>
            </ListItem>
          )}
          keyExtractor={(item) => item.name}
          ItemSeparatorComponent={renderSeparator}
        />
      </View>
      <View style={styles.footerButtonWrapper}>
        <Text style={styles.errorMessage}>{errorMessage}</Text>
        <TouchableOpacity
          onPress={() => selectSupplier()}
          style={[styles.footerButton, {backgroundColor: props.color}]}>
          <Text style={styles.footerButtonText}>Select Supplier</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
export default SelectSupplierModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
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
  listWrapper: {
    width: '100%',
    marginBottom: 20,
    height: 520,
  },
  listItemTitle: {
    fontSize: 16,
    fontFamily: theme.font.regular,
    textTransform: 'capitalize',
  },
  inputContainer: {
    justifyContent: 'center',
    borderLeftColor: theme.gradient.blue,
    borderRightColor: theme.gradient.blue,
    borderTopColor: theme.gradient.blue,
    borderBottomColor: theme.gradient.blue,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderRadius: 0,
    width: '100%',
    backgroundColor: 'transparent',
    height: 50,
    paddingBottom: 4,
  },
  inputText: {
    color: theme.gradient.blue,
    fontFamily: theme.font.regular,
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
  },
  footerButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: theme.font.regular,
    textTransform: 'uppercase',
  },
});
