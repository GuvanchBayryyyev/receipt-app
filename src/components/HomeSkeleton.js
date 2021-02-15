import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import theme from '../theme';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';

const HomeSkeleton = (props) => {
  return (
    <View style={{width: '100%'}}>
      <SkeletonContent
        containerStyle={{alignItems: 'center'}}
        isLoading={true}
        layout={[
          {
            key: '1',
            width: '100%',
            maxWidth: 300,
            height: 60,
            marginBottom: 2,
            marginVertical: 20,
          },
          {
            key: '2',
            width: 100,
            height: 100,
            borderRadius: 100,
            borderWidth: 1,
            borderColor: 'white',
            marginVertical: 20,
          },
          {
            key: '3',
            minWidth: 200,
            width: 200,
            height: 20,
            borderRadius: 15,
            marginBottom: 10,
          },
          {
            key: '4',
            minWidth: 200,
            width: 200,
            height: 20,
            borderRadius: 15,
            marginBottom: 10,
          },
          {
            key: '5',
            minWidth: 200,
            width: 200,
            height: 20,
            borderRadius: 15,
            marginBottom: 10,
          },
          {
            key: '6',
            width: '90%',
            maxWidth: 500,
            height: 10,
            margin: 20,
          },

          {
            key: '9',
            width: '90%',
            height: 150,
            marginBottom: 10,
          },
          {
            key: '10',
            maxWidth: 340,
            width: '90%',
            height: 40,
            marginVertical: 10,
          },
          {
            key: '11',
            maxWidth: 340,
            width: '90%',
            height: 40,
            marginBottom: 10,
          },
          {
            key: '12',
            maxWidth: 340,
            width: '90%',
            height: 40,
            marginBottom: 10,
          },
        ]}></SkeletonContent>
    </View>
  );
};

export default HomeSkeleton;
