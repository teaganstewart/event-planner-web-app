import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

const Loader = props => {
    const {
        loading,
        ...attributes
    } = props;

    return (
        <View style={styles.loading}>
            <ActivityIndicator size='large' />
        </View>
    )
}

const styles = StyleSheet.create({
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    }
});

export default Loader;