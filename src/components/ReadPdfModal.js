import React, {useState} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Modal,
  TouchableOpacity,
  Text,
} from 'react-native';
import {Icon} from 'react-native-elements';
import Pdf from 'react-native-pdf';
import theme from '../theme';

const ReadPdfModal = (props) => {
  let link = props.fileLink.replace('http', 'https');
  link = link.replace('//api/bons/pdf', '/api/bons/pdf');
  const source = {
    uri: link,
    cache: true,
  };
  // here we change link format from 'http' to 'https'
  //const source = require('./test.pdf');  // ios only
  //const source = {uri:'bundle-assets://test.pdf'};

  //const source = {uri:'file:///sdcard/test.pdf'};
  //const source = {uri:"data:application/pdf;base64,JVBERi0xLjcKJc..."};

  return (
    <Modal
      animationType="slide"
      style={styles.container}
      isVisible={props.readModal}>
      <View style={[styles.header, {backgroundColor: props.color}]}>
        <Text style={styles.centerText}>{props.fileName}</Text>
        <TouchableOpacity
          style={styles.headerWrapper}
          onPress={() => {
            props.setmodal(false);
          }}>
          <Icon name="close" color="white" type="ionicon" size={40} />
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Pdf
          source={source}
          onLoadComplete={(numberOfPages, filePath) => {
            // console.log(`number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            // console.log(`current page: ${page}`);
          }}
          onError={(error) => {
            console.log(error);
          }}
          onPressLink={(uri) => {
            // console.log(`Link presse: ${uri}`)
          }}
          style={styles.pdf}
        />
      </View>
    </Modal>
  );
};
export default ReadPdfModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
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
    fontSize: 14,
    fontFamily: theme.font.regular,
    flex: 1,
    flexWrap: 'wrap',
  },
  closeText: {
    color: 'white',
    fontFamily: theme.font.regular,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
