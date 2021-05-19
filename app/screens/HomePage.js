import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Image, TextInput, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import 'react-native-gesture-handler';

const Stack = createStackNavigator();

function HomePage() {


  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen>
          <SafeAreaView style={styles.container}>
            <View style={styles.form}>
              <Image style={styles.logo} source={require("./assets/logo.png")} />
              <TextInput maxLength={20} style={styles.textInput} placeholder='Username' placeholderTextColor='#ff66ff'/>
              <TextInput style={styles.textInput} secureTextEntry={true} placeholderTextColor='#ff66ff' placeholder="Password" />
              <Button color='#ff66ff' title="Login" onPress={() => navigation.navigate('nameofSCreen')}/>
            </View>
            <StatusBar style="auto" />
          </SafeAreaView>
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
    
  },
  form: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  textInput: {
    backgroundColor: '#6ECC77',
    width: 300,
    borderRadius: 20,
    height: 40,
    marginBottom: 20,
    textAlign: 'center'
  },
  logo: {
    height: 220
  }

});


export default HomePage;