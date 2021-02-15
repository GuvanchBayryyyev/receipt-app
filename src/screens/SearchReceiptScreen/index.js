import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {Input, Icon, ListItem, Avatar} from 'react-native-elements';
import theme from '../../theme';
import {TouchableOpacity} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import SelectSupplierModal from '../../components/SelectSupplierModal';
import SelectDateModal from '../../components/SelectDateModal';
import ReadPdfModal from '../../components/ReadPdfModal';
import AppApi from '../../api/app';
import moment from 'moment';
import {connect} from 'react-redux';
import InputButton from '../../components/InputButton';
import CustomButton from '../../components/CustomButton';
const screenHeight = Math.round(Dimensions.get('window').height);

const SearchReceiptScreen = (props) => {
  const placeholSupplier = 'Search supplier';
  const placeholDate = 'Select date';
  const [supplier, setSupplier] = useState({name: placeholSupplier, id: ''});
  const [date, setDate] = useState(placeholDate);
  const [dateModal, setDateModal] = useState(false);
  const [supplierModal, setSupplierModal] = useState(false);
  const [otherSearch, setOtherSearch] = useState(false);
  const [searching, setSearching] = useState(false);
  const noDataText = 'No data found';
  const [noData, setNoData] = useState(noDataText);
  const keyExtractor = (item, index) => index.toString();
  const setFieldsEmpty = () => {
    setSupplier({name: placeholSupplier, id: ''});
    setDate(placeholDate);
    setSearchFiles([]);
    setNoData('');
  };
  const [searchFiles, setSearchFiles] = useState();
  const [fileName, setFileName] = useState('');
  const [fileLink, setFileLink] = useState('');
  const [readModal, setReadModal] = useState(false);
  const onReadModal = (filename, filelink) => {
    setReadModal(true);
    setFileName(filename);
    setFileLink(filelink);
  };

  // useEffect(() => {
  //   function getSuppliers() {
  //     const token = props.token;
  //     AppApi.getSuppliers(token).then((res) => {
  //       if (res.data) {
  //         props.setSuppliers(res.data.data);
  //       } else {
  //         console.warn('No Suppliers');
  //       }
  //     });
  //   }
  //   if (props.suppliers == null || props.suppliers.length == 0) {
  //     getSuppliers();
  //   } else {
  //     alert('already');
  //   }
  // }, []);
  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        onReadModal(item.pdf_file_name, item.pdf_file);
      }}>
      <ListItem bottomDivider>
        <Avatar
          icon={{
            name: 'picture-as-pdf',
            color: 'purple',
            type: 'materialicon',
            size: 30,
          }}
        />
        <ListItem.Content>
          <ListItem.Title style={{fontFamily: theme.font.regular}}>
            {item.pdf_file_name}
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
    </TouchableOpacity>
  );
  const onSearch = () => {
    setNoData(noDataText);
    setSearching(true);
    setSearchFiles([]);
    var result = null;
    result = props.bons.filter((data) => {
      var supplierId = '';
      // var fileName = data.pdf_file_name.toString();
      // var pattern = /\-(.*)\-/g;
      const updateDate = data.created_at.substring(0, 10);
      // const fullDate = fileName.match(pattern).toString();
      const day = updateDate.substring(8, 10);
      const month = updateDate.substring(5, 7);
      const year = updateDate.substring(0, 4);
      const checkdate = day + '/' + month + '/' + year;
      const selectedDate = moment(date).format('DD/MM/YYYY');
      if (data.supplier !== null && data.supplier.id !== null) {
        supplierId = data.supplier.id;
      }
      if (supplier.name != placeholSupplier && date == placeholDate) {
        // search by Supplier Name only
        return supplierId == supplier.id;
      }
      if (supplier.name == placeholSupplier && date != placeholDate) {
        // search by Date only
        return checkdate == selectedDate;
      }
      if (supplier.name == placeholSupplier && date == placeholDate) {
        // if no date or supplier selected
        setNoData('Please choose Supplier and/or Date');
      }
      return supplierId == supplier.id && checkdate == selectedDate; // search by both supplier and date
    });
    setSearchFiles(result);
    setOtherSearch(true);
    setSearching(false);
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          width: '100%',
          paddingTop: 20,
          justifyContent: 'center',
          paddingHorizontal: 20,
        }}>
        <InputButton
          title={supplier.name}
          titleColor={
            supplier.name == placeholSupplier
              ? theme.input.placeholder
              : theme.input.color
          }
          icon={true}
          iconName="chevron-down-sharp"
          iconColor={theme.gradient.blue}
          iconType="ionicon"
          onPress={() => {
            setSupplierModal(true);
          }}
        />
        <InputButton
          title={
            date == placeholDate
              ? date
              : date.getDate() +
                '/' +
                (date.getMonth() + 1) +
                '/' +
                date.getFullYear()
          }
          titleColor={
            date == placeholDate ? theme.input.placeholder : theme.input.color
          }
          icon={true}
          iconName="calendar-outline"
          iconColor={theme.gradient.blue}
          iconType="ionicon"
          onPress={() => {
            setDateModal(true);
          }}
        />
        <View style={styles.bottomLine}></View>
      </View>
      <View style={styles.listWrapper}>
        <FlatList
          keyExtractor={keyExtractor}
          data={searchFiles}
          renderItem={renderItem}
          scrollEnabled={true}
        />
        {searchFiles && searchFiles.length == 0 ? (
          <View style={{alignSelf: 'center', paddingTop: 20}}>
            <Text style={{color: 'grey', fontFamily: theme.font.regular}}>
              {noData}
            </Text>
          </View>
        ) : null}
        {searching ? (
          <View style={{alignSelf: 'center'}}>
            <ActivityIndicator color="purple" size="large"></ActivityIndicator>
          </View>
        ) : null}
      </View>
      <View style={styles.footer}>
        {otherSearch ? (
          <CustomButton
            title="other search"
            icon={false}
            onPress={() => setFieldsEmpty()}
          />
        ) : null}
        <CustomButton
          onPress={() => onSearch()}
          title="search receipt"
          icon={false}
        />
      </View>
      {supplierModal ? (
        <SelectSupplierModal
          suppliers={props.suppliers}
          setmodal={(visible) => {
            setSupplierModal(visible);
          }}
          setSupplier={(data) => {
            setSupplier(data);
          }}
          color={props.color}
        />
      ) : null}
      {dateModal ? (
        <SelectDateModal
          setmodal={(visible) => {
            setDateModal(visible);
          }}
          setDate={(data) => {
            setDate(data);
          }}
          color={props.color}
        />
      ) : null}
      {readModal ? (
        <ReadPdfModal
          setmodal={(visible) => {
            setReadModal(visible);
          }}
          fileName={fileName}
          fileLink={fileLink}
          color={props.color}
        />
      ) : null}
    </View>
  );
};
const mapStatetoProps = (state) => {
  return {
    userInfo: state.user.userInfo,
    color:
      state.user.userInfo != null
        ? state.user.userInfo.location.theme.color
        : 'grey',
    token: state.user.authToken,
    bons: state.user.bons,
    suppliers: state.user.suppliers,
  };
};
export default connect(mapStatetoProps)(SearchReceiptScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background.white,
    alignItems: 'center',
  },
  inputWrapper: {
    alignSelf: 'center',
    height: 50,
    marginBottom: 20,
    borderColor: theme.gradient.blue,
    borderWidth: 1,
    borderRadius: 5,
    width: '80%',
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
  bottomLine: {
    borderWidth: 1,
    borderColor: theme.gradient.blue,
    marginVertical: 10,
  },
  listWrapper: {
    width: '100%',
    height: 'auto',
    maxHeight: screenHeight ? screenHeight - 400 : 300,
    marginBottom: 20,
    marginTop: 10,
  },
  footer: {
    marginHorizontal: 20,
    position: 'absolute',
    bottom: 40,
    maxWidth: 500,
    alignSelf: 'center',
  },
});
