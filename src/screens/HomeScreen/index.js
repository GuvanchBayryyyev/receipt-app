import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Platform,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Avatar, Icon, ListItem } from 'react-native-elements';
import theme from '../../theme';
import ReadPdfModal from '../../components/ReadPdfModal';
import axios from 'axios';
import AppApi from '../../api/app';
import AsyncStorage from '@react-native-community/async-storage';
import CustomButton from '../../components/CustomButton';
import HomeSkeleton from '../../components/HomeSkeleton';
import { connect } from 'react-redux';
import {
  setUserInfo,
  setBons,
  setUserAuth,
  setSuppliers,
} from '../../store/actions';
import { useNavigation } from '@react-navigation/native';

const screenHeight = Math.round(Dimensions.get('window').height);

const HomeScreen = (props) => {
  const [fetchingBons, setFetchingBons] = useState(true);
  const [fetchingUser, setFetchingUser] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [userInfo, setUserInfo] = useState([]);

  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await setUserToken();
    });
    setUserToken();
    return unsubscribe;
  }, [navigation]);
  const setUserToken = async () => {
    if (props.token == null) {
      try {
        let tok = await AsyncStorage.getItem('token');
        if (tok == null) {
          props.navigation.navigate('LoginScreen');
          return;
        }
        props.setUserAuth(tok);
        if (props.userInfo == null) {
          await getUserData(tok);
        }
        await getBons(tok);
      } catch (error) { }
    } else {
      await getBons(props.token);
    }
  };
  const getUserData = (token) => {
    setFetchingUser(true);
    AppApi.getCurrentUser(token).then(async (res) => {
      if (res.data) {
        props.setUserInfo(res.data.data);
        setUserInfo(res.data.data);
        await getSuppliers(token, res.data.data);
        setFetchingUser(false);
      } else {
        setFetchingUser(false);
      }
    });
  };
  const getBons = async (token) => {
    setFetchingBons(true);
    AppApi.getBons(token).then((res) => {
      if (res.data) {
        props.setBons(res.data.bons);
        console.log(res.data.bons)
        setFetchingBons(false);
      } else {
        setFetchingBons(false);
      }
    });
  };
  const getSuppliers = (token, user) => {
    AppApi.getSuppliers(token).then((res) => {
      if (res.data) {
        const filtered = res.data.data.filter((data) => {
          return data.company.id == user.company.id;
        });
        props.setSuppliers(filtered);
      } else {
        console.warn('No Suppliers');
      }
    });
  };
  const [fileName, setFileName] = useState('');
  const [fileLink, setFileLink] = useState('');
  const [readModal, setReadModal] = useState(false);
  const onReadModal = (filename, filelink) => {
    setReadModal(true);
    setFileName(filename);
    setFileLink(filelink);
  };
  const keyExtractor = (item, index) => index.toString();
  const renderItem = ({ item }) => {
    if (
      props.userInfo.role == 'receptionist' ||
      props.userInfo.role == 'consultant'
    ) {
      if (item.user.location.id == props.userInfo.location_id) {
        return listItem(item);
      }
    } else if (
      props.userInfo.role == 'bookkeeper' ||
      props.userInfo.role == 'admin'
    ) {
      if (item.company_id == props.userInfo.company.id) {
        return listItem(item);
      }
    } else {
      return listItem(item);
    }
  };
  const listItem = (item) => {
    return (
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
            <ListItem.Title style={{ fontFamily: theme.font.regular }}>
              {item.pdf_file_name} {item.created_at}
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </TouchableOpacity>
    );
  };

  const logout = async () => {
    try {
      await AsyncStorage.setItem('token', '');
      props.navigation.replace('LoginScreen');
    } catch (error) {
      console.log(error);
    }
  };
  return fetchingUser ? (
    <View style={styles.container}>
      <HomeSkeleton />
    </View>
  ) : (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={{
              uri: `http://saasbons.wedowebdev.site/${props.userInfo.location.theme.logo}`,
            }}
            style={styles.logo}
          />
        </View>
        <View style={styles.profileWrapper}>
          {fetchingUser && showLoading ? (
            <View style={{ height: 140 }}>
              <ActivityIndicator size="small" color="red" />
            </View>
          ) : (
              <>
                <Avatar
                  size="large"
                  rounded
                  source={{
                    uri: `${axios.defaults.baseURL}/img/${props.userInfo.avatar}`,
                  }}
                />
                <View style={styles.profileInfo}>
                  <View
                    style={{
                      paddingRight: 10,
                    }}>
                    <Text style={styles.infoTitle}>User:</Text>
                    <Text style={styles.infoTitle}>Role:</Text>
                    <Text style={styles.infoTitle}>Branch:</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'column',
                    }}>
                    <Text style={styles.infoValue}>{props.userInfo.username} </Text>
                    <Text style={styles.infoValue}>{props.userInfo.role} </Text>
                    <Text style={styles.infoValue}>
                      {props.userInfo.location.name}
                    </Text>
                  </View>
                </View>
              </>
            )}
        </View>
        <View
          style={[
            styles.profileLine,
            { backgroundColor: props.userInfo.location.theme.color },
          ]}></View>
        <View style={styles.listTitle}>
          <Text style={styles.listTitleText}>Recent added receipts</Text>
        </View>
        <View
          style={{
            width: '100%',
            marginBottom: 10,
            marginTop: 10,
            flexGrow: 0,
          }}>
          {fetchingBons && showLoading ? (
            <ActivityIndicator size="small" color="grey" />
          ) : (
              <FlatList
                keyExtractor={keyExtractor}
                data={props.bons}
                renderItem={renderItem}
                scrollEnabled={true}
                style={{
                  height:
                    props.userInfo.role == 'receptionist'
                      ? Platform.OS == 'ios'
                        ? screenHeight - 500
                        : screenHeight - 460
                      : Platform.OS == 'ios'
                        ? screenHeight - 550
                        : screenHeight - 510,
                }}
              />
            )}
        </View>
        {props.userInfo == null ? null : (
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              paddingHorizontal: 30,
              position: 'absolute',
              bottom: 10,
              maxWidth: 600,
            }}>
            {props.userInfo.role == 'receptionist' ? null : (
              <CustomButton
                title="Search receipt"
                icon={false}
                // iconName="search"
                // iconType="font-awesome"
                // iconColor="white"
                // iconSize={22}
                onPress={() => props.navigation.push('SearchReceiptScreen')}
              />
            )}
            <CustomButton
              title="ADD RECEIPT"
              icon={false}
              // iconName="add-circle-outline"
              // iconType="materialicon"
              // iconColor="white"
              // iconSize={26}
              onPress={() => props.navigation.push('AddReceiptScreen')}
            />
            <CustomButton
              title="LOGOUT"
              icon={false}
              // iconName="sign-out"
              // iconType="font-awesome"
              // iconColor="white"
              // iconSize={26}
              onPress={() => logout()}
            />
          </View>
        )}
        {readModal ? (
          <ReadPdfModal
            setmodal={(visible) => {
              setReadModal(visible);
            }}
            fileName={fileName}
            fileLink={fileLink}
            color={props.userInfo.location.theme.color}
          />
        ) : null}
      </View>
    );
};
const mapStatetoProps = (state) => {
  return {
    userInfo: state.user.userInfo,
    bons: state.user.bons,
    addedNewBon: state.user.addedNewBon,
    token: state.user.authToken,
  };
};
const mapDispatchtoProps = (dispatch) => {
  return {
    setUserInfo: (user) => dispatch(setUserInfo(user)),
    setUserAuth: (token) => dispatch(setUserAuth(token)),
    setBons: (bons) => dispatch(setBons(bons)),
    setSuppliers: (supps) => dispatch(setSuppliers(supps)),
  };
};
export default connect(mapStatetoProps, mapDispatchtoProps)(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.background.white,
    paddingTop: Platform.OS == 'ios' ? 40 : 0,
  },
  header: {
    width: '100%',
    height: 66,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  profileWrapper: {
    alignItems: 'center',
    width: '100%',
    top: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    padding: 20,
    width: '100%',
    justifyContent: 'center',
  },
  infoTitle: {
    color: theme.gradient.blue,
    fontSize: 16,
    textAlign: 'right',
    fontFamily: theme.font.regular,
  },
  infoValue: {
    fontSize: 16,
    textTransform: 'capitalize',
    fontFamily: theme.font.regular,
  },
  profileLine: {
    width: '90%',
    height: 5,
    margin: 20,
  },
  listTitle: {
    width: '100%',
    paddingHorizontal: 20,
  },
  listTitleText: {
    fontSize: 20,
    fontFamily: theme.font.regular,
  },
  logo: {
    height: 40,
    width: 200,
    resizeMode: 'stretch',
  },
});
