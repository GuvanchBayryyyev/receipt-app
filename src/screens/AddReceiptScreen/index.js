import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import {Icon, CheckBox} from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
import {TouchableOpacity} from 'react-native-gesture-handler';
import theme from '../../theme';

import SelectSupplierModal from '../../components/SelectSupplierModal';
import SelectDateModal from '../../components/SelectDateModal';
import RemarkModal from '../../components/RemarkModal';

import AppApi from '../../api/app';
import Spinner from 'react-native-loading-spinner-overlay';
import RNImageToPdf from 'react-native-image-to-pdf';
import axios from 'axios';
import RNFS from 'react-native-fs';
import moment from 'moment-timezone';
import {
  PERMISSIONS,
  request,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import InputButton from '../../components/InputButton';
import CustomButton from '../../components/CustomButton';
import {setAddedNewBon} from '../../store/actions';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const AddReceiptScreen = (props) => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [imagePaths, setImagePaths] = useState([]);

  const [supplierModal, setSupplierModal] = useState(false);
  const [dateModal, setDateModal] = useState(false);
  const [remarkModal, setRemarkModal] = useState(false);

  const placeholSupplier = 'Select supplier';
  const placeholDate = 'Select Date and Time';
  const placeholRemark = 'Type Remark ...';

  const [supplier, setSupplier] = useState(placeholSupplier);
  const [date, setDate] = useState(placeholDate);
  const [remark, setRemark] = useState(placeholRemark);

  const converting = 'Converting to PDF...';
  const uploading = 'Uploading...';

  const [supplierId, setSupplierId] = useState(null);
  const keyExtractor = (item, index) => index.toString();
  const [refresh, toggleRefresh] = useState(false);
  const [tag, setTag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(converting);
  const [iosCameraState, setIosCameraState] = useState();
  const [andCameraState, setAndCameraState] = useState();
  const onSupplier = (data) => {
    setSupplier(data.name);
    setSupplierId(data.id);
  };
  useEffect(() => {
    takePhotoFromCamera();
  }, []);
  const takePhotoFromCamera = async () => {
    if (Platform.OS == 'ios') {
      request(PERMISSIONS.IOS.CAMERA)
        .then((result) => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              setIosCameraState('unavailable');
              break;
            case RESULTS.DENIED:
              setIosCameraState('denied');
              break;
            case RESULTS.GRANTED:
              setIosCameraState('granted');
              chooseImage();
              break;
            case RESULTS.BLOCKED:
              setIosCameraState('blocked');
            default:
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      request(PERMISSIONS.ANDROID.CAMERA)
        .then((result) => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              setAndCameraState('unavailable');
              break;
            case RESULTS.DENIED:
              setAndCameraState('denied');
              break;
            case RESULTS.GRANTED:
              setAndCameraState('granted');
              chooseImage();
              break;
            case RESULTS.BLOCKED:
              setAndCameraState('blocked');
            default:
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const chooseImage = () => {
    ImagePicker.openCamera({
      width: 900,
      height: 1200,
      mediaType: 'photo',
      cropping: true,
    })
      .then((image) => {
        images.push({link: image.path});
        toggleRefresh(!refresh);
        var path = Platform.OS == 'ios' ? image.path : image.path.substring(6);
        imagePaths.push(path);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const myAsyncPDFFunction = async () => {
    if (imagePaths.length == 0) {
      setError('Please add image');
      return;
    } else if (supplierId == null) {
      setError('Please choose supplier');
      return;
    }
    try {
      setLoading(true);
      const options = {
        imagePaths: imagePaths,
        name: 'PDFName',
        maxSize: {
          // optional maximum image dimension - larger images will be resized
          width: 1800,
          height: Math.round((2000 / 1800) * 1800),
        },
        quality: 0.9, // optional compression paramter
      };
      const pdf = await RNImageToPdf.createPDFbyImages(options);
      setLoadingText(uploading);
      onCreateBons(pdf);
    } catch (e) {
      console.log('Error ' + e);
      setLoading(false);
      setLoading(false);
    }
  };

  const onCreateBons = async (pdf) => {
    try {
      let url = '/api/bons';
      var pdf = await RNFS.readFile(`file://${pdf.filePath}`, 'base64').then(
        (res) => {
          return res;
        },
      );
      var data = new FormData();
      data.append('supplier_id', supplierId);
      data.append('status', 0);
      data.append('pdf_file', pdf);
      data.append('alert', tag ? 1 : 0);
      data.append('comment', remark == placeholRemark ? '' : remark);
      if (date !== placeholDate) {
        // if date chosem, time is static
        data.append('date', moment(date).format('YYYY-MM-DD HH:mm:ss'));
      } else {
        // if date chosem, time is dynamic, current time
        data.append(
          'date',
          moment.tz('Europe/Brussels').format('YYYY-MM-DD HH:mm:ss'),
        );
      }
      let headers = {Authorization: `Bearer ${props.token}`};
      console.log(data);
      let res = await axios({
        method: 'post',
        url: url,
        data: data,
        headers,
      });
      if (res.data.status == 'success') {
        props.setAddedNewBon();
        props.navigation.navigate('HomeScreen');
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const renderItem = ({item, index}) => (
    <View style={styles.item}>
      {index == 0 ? (
        <TouchableOpacity
          style={{padding: 10, alignItems: 'center', justifyContent: 'center'}}
          onPress={() => {
            takePhotoFromCamera();
          }}>
          <Icon name="add-circle-outline" type="ionicon" size={60} />
          <Text style={{fontFamily: theme.font.regular}}>Add Pages</Text>
        </TouchableOpacity>
      ) : null}
      <Image source={{uri: item.link}} style={styles.image} />
      <View
        style={{
          position: 'absolute',
          backgroundColor: 'white',
          top: 8,
          right: 5,
          borderRadius: 4,
        }}>
        <Icon
          name="close"
          type="ionicon"
          size={20}
          onPress={() => {
            images.splice(index, 1);
            toggleRefresh(!refresh);
          }}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Spinner
        visible={loading}
        textContent={loadingText}
        textStyle={{
          fontSize: 14,
          fontWeight: 'normal',
          fontFamily: theme.font.regular,
          color: 'white',
        }}
      />
      {Platform.OS == 'ios' && iosCameraState != 'granted' ? (
        <TouchableOpacity
          style={{paddingVertical: 3}}
          onPress={() => {
            openSettings();
          }}>
          <Text style={{color: 'blue'}}>Enable Camera Access</Text>
        </TouchableOpacity>
      ) : null}
      {Platform.OS == 'android' && andCameraState != 'granted' ? (
        <TouchableOpacity
          style={{
            paddingVertical: 3,
            borderWidth: 1,
            borderColor: theme.gradient.blue,
            borderRadius: 5,
            paddingHorizontal: 10,
            marginVertical: 10,
          }}
          onPress={() => {
            openSettings();
          }}>
          <Text style={{color: theme.gradient.blue}}>Enable Camera Access</Text>
        </TouchableOpacity>
      ) : null}
      <View style={{width: '100%', maxWidth: 600}}>
        <FlatList
          horizontal
          contentContainerStyle={{flexDirection: 'row'}}
          data={images}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          extraData={refresh}
          showsHorizontalScrollIndicator={false}
        />
        {images.length == 0 ? (
          <View style={{display: 'flex', alignItems: 'flex-start'}}>
            <TouchableOpacity
              onPress={() => {
                takePhotoFromCamera();
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingVertical: 5,
              }}>
              <Icon name="add-circle-outline" type="ionicon" size={60} />
              <Text style={{fontFamily: theme.font.regular}}>Add Pages</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <View>
          <InputButton
            title={supplier}
            titleColor={
              supplier == placeholSupplier
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
                  date.getFullYear() +
                  ' ' +
                  date.getHours() +
                  ':' +
                  date.getMinutes()
            }
            titleColor={
              date == placeholDate ? theme.input.placeholder : theme.input.color
            }
            icon={true}
            iconName="ios-time-outline"
            iconColor={theme.gradient.blue}
            iconType="ionicon"
            onPress={() => {
              setDateModal(true);
            }}
          />

          <DateTimePickerModal
            isVisible={dateModal}
            mode="datetime"
            date={new Date()}
            locale="fr-BE"
            onConfirm={(datetime) => {
              setDateModal(false);
              setDate(datetime);
            }}
            onCancel={(value) => {
              setDateModal(false);
            }}
          />
          <Text
            style={{
              paddingBottom: 5,
              fontSize: 16,
              textTransform: 'uppercase',
              fontFamily: theme.font.regular,
            }}>
            Add Remark
          </Text>
          <TouchableOpacity
            onPress={() => {
              setRemarkModal(true);
            }}
            style={[styles.inputWrapper, {height: 100}]}>
            <Text
              multiple={true}
              numberOfLines={3}
              style={[
                styles.buttonText,
                {height: 100, paddingVertical: 5},
                {
                  color:
                    remark == placeholRemark
                      ? theme.input.placeholder
                      : theme.input.color,
                },
              ]}>
              {remark.length > 0
                ? remark.length > 98
                  ? remark.substring(0, 100) + '...'
                  : remark
                : placeholRemark}
            </Text>
            {/* <Icon
                name="chevron-down-sharp"
                color={theme.gradient.blue}
                type="ionicon"
              /> */}
          </TouchableOpacity>
          <CheckBox
            containerStyle={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              justifyContent: 'center',
            }}
            title={
              <Text style={{fontSize: 18, fontFamily: theme.font.regular}}>
                Tag this receipt
              </Text>
            }
            textStyle={{
              fontSize: 18,
              fontFamily: theme.font.regular,
            }}
            checked={tag}
            checkedIcon={
              <Icon
                name="check-box"
                color={theme.gradient.blue}
                type="materialicon"
                size={34}
              />
            }
            uncheckedIcon={
              <Icon
                name="check-box-outline-blank"
                color={theme.gradient.blue}
                type="materialicon"
                size={34}
              />
            }
            onPress={() => setTag(!tag)}
          />
        </View>
      </View>
      <View style={styles.footer}>
        <Text
          style={{
            paddingVertical: 10,
            color: theme.gradient.red,
            alignSelf: 'center',
            fontFamily: theme.font.regular,
          }}>
          {error}
        </Text>
        <CustomButton
          title="Save and close receipt"
          icon={false}
          onPress={() => myAsyncPDFFunction()}
        />
      </View>
      {/* {dateModal ? (
        <SelectDateModal
          setmodal={(visible) => {
            setDateModal(visible);
          }}
          setDate={(data) => {
            setDate(data);
          }}
          color={props.color}
        />
      ) : null} */}
      {supplierModal ? (
        <SelectSupplierModal
          suppliers={props.suppliers}
          setmodal={(visible) => {
            setSupplierModal(visible);
          }}
          setSupplier={(data) => {
            onSupplier(data);
          }}
          color={props.color}
        />
      ) : null}
      {remarkModal ? (
        <RemarkModal
          setmodal={(visible) => {
            setRemarkModal(visible);
          }}
          setRemark={(data) => {
            if (data.length == 0) {
              setRemark(placeholRemark);
            } else {
              setRemark(data);
            }
          }}
          remark={remark == placeholRemark ? '' : remark}
          color={props.color}
        />
      ) : null}
    </SafeAreaView>
  );
};
const mapStatetoProps = (state) => {
  return {
    color: state.user.userInfo.location.theme.color,
    token: state.user.authToken,
    suppliers: state.user.suppliers,
  };
};
const mapDispatchtoProps = (dispatch) => {
  return {
    setAddedNewBon: () => dispatch(setAddedNewBon(true)),
  };
};
export default connect(mapStatetoProps, mapDispatchtoProps)(AddReceiptScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginHorizontal: Platform.OS == 'ios' ? 20 : 0,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 100,
    borderWidth: 0.5,
    borderColor: 'grey',
    borderRadius: 4,
  },
  item: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    flexDirection: 'row',
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
  buttonText: {
    fontSize: 18,
    fontFamily: theme.font.regular,
  },
  footer: {
    right: 0,
    left: 0,
    marginHorizontal: 20,
    maxWidth: 600,
  },
  buttonGradient: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  footerButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: theme.font.regular,
    textTransform: 'uppercase',
    paddingHorizontal: 20,
  },
});
