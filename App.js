import { setStatusBarNetworkActivityIndicatorVisible, StatusBar } from 'expo-status-bar';
import React, { Component, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TextInput, Button, ScrollView, Alert, TouchableOpacityBase } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator, HeaderStyleInterpolators} from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import  MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import firebase from './firebaseConfig';
import 'react-native-gesture-handler';
import {withNavigation} from 'react-navigation';
import { Card, ListItem, Icon, Overlay } from 'react-native-elements';
import { ViewBase } from 'react-native';

const Stack = createStackNavigator(); // manage page navigation login -> home
const Tab = createMaterialBottomTabNavigator(); // bottom page navigator for content in the app

class Register extends Component { // Register class, manage text input using state and a constructor
   constructor(props) {
     super(props);
     this.state = {
       email: '',
       password: ''
     }
   }

   inputValueUpdate = (val, prop) =>
   {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
     
   }
   addUser(email, password){
     if(email == '')
     {
       Alert.alert('Missing email', 'Please enter your email.');
     }
     else if(password == '')
     {
       Alert.alert('Missing password', 'Please enter your password.');
     }
     else{
      firebase.auth().createUserWithEmailAndPassword(email, password).then((userCredential) => {
        var user = userCredential.user;
      } ).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        Alert.alert("Invalid input", errorMessage);
      })
      
      //TODO clear text after registration
     }
     

  }

  render() {
    return(
      <SafeAreaView style={styles.container}>
        <View style={styles.form}>
          <Text style={styles.title}>Create an account below</Text>
          <TextInput maxLength={20} style={styles.textInput} placeholder='Username' placeholderTextColor='#ff66ff'
          value={this.state.email} onChangeText={ (val) => this.inputValueUpdate(val, 'email') }/>
          <TextInput style={styles.textInput} secureTextEntry={true} placeholderTextColor='#ff66ff' placeholder="Password" 
            value={this.state.password} onChangeText={(val) => this.inputValueUpdate(val, 'password')}/>
          <Button color='#ff66ff' title="Register" onPress={() => this.addUser(this.state.email, this.state.password)}/> 
          <Text style={styles.register} onPress={() => this.props.navigation.navigate('Login')}>Login</Text>
        </View>
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }

  
}

const headerBar = { // predefined styles for navigator bar
  headerLeft: false,
  headerTitleAlign: 'center',
  headerTintColor: '#ff66ff',
  headerTitleStyle: {
    color: 'white',
  },
  headerStyle: {
    backgroundColor: '#ff66ff'
  }
}
class Login extends Component { // login logic, uses firebase built-in methods to authenticate
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
  }

  inputValueUpdate = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }
  loginUser(email, password){
    if(email == '')
    {
      Alert.alert('Missing email', 'Please enter your email.');
    }
    else if(password == '')
    {
      Alert.alert('Missing password', 'Please enter your password.');
    }
    else{
      firebase.auth().signInWithEmailAndPassword(email, password).then((userCredential) => {
        var user = userCredential.user;
        this.props.navigation.navigate('Your Food MarketPlace');
       } ).catch((error) => {
         var errorCode = error.code;
         var errorMessage = error.message;
         Alert.alert("Invalid input", errorMessage);
       })
    }
  }

  render() {
    return(
      <SafeAreaView style={styles.container}>
        <View style={styles.form}>
          <Image style={styles.logo} source={require("./app/assets/logo.png")} />
          <TextInput maxLength={20} style={styles.textInput} placeholder='Username' placeholderTextColor='#ff66ff'
          value={this.state.email} onChangeText={ (val) => this.inputValueUpdate(val, 'email')} leftIcon={{ type: 'font-awesome', name: 'chevron-left' }}/>
          <TextInput style={styles.textInput} secureTextEntry={true} placeholderTextColor='#ff66ff' placeholder="Password" 
          value={this.state.password} onChangeText={(val) => this.inputValueUpdate(val, 'password')}/>
          <Button color='#ff66ff' title="Login" onPress={() => this.loginUser(this.state.email, this.state.password)}/>
          <Text style={styles.register} onPress={() => this.props.navigation.navigate('Register')}>Create an account.</Text>
        </View>
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }
  
}

const AppContent = ( {navigation} ) => { // NavBar
  return (
    <Tab.Navigator activeColor='#6ECC77' inactiveColor='#ffffff' barStyle={{backgroundColor: '#ff66ff'}}>
      <Tab.Screen name="Home" component={Index} options={{tabBarIcon: 
        ({color}) => (
          <MaterialCommunityIcons name="home" color={color} size={26} />
        )
      }} /> 
      <Tab.Screen name="Buy" component={Buy} options={{tabBarIcon: 
        ({color}) => (
          <MaterialCommunityIcons name="basket" color={color} size={26} />
        )
      }} /> 
      <Tab.Screen name="Sell" component={Sell} options={{tabBarIcon: 
        ({color}) => (
          <MaterialCommunityIcons name="cash" color={color} size={26} />
        )
      }} />
      <Tab.Screen name="Your profile" component={YourProfile} options={{tabBarIcon: 
        ({color}) => (
          <MaterialCommunityIcons name="account-circle" color={color} size={26} />
        )
      }} />
    </Tab.Navigator>
  );
}
const Index = ( {navigation} ) => { // index page mananger, when user clicks login he arrives here
  const [visible, setVisible] = useState(false);// toggle overlay -> view card.

  const toggleOverlay = () => { 
    setVisible(!visible);
  }  
  // array of card objects -> create long scrollview

  return (
    <View>
      <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <Text>TEST</Text>
      </Overlay>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card>
          <Card.Title>NEW APPLES</Card.Title>
          <Card.Image source={require('./app/assets/apple.jpg')}/>
          <Card.Divider/>
                <Text style={{ marginBottom: 10}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam hendrerit pharetra sodales. In viverra risus vel elit efficitur mollis. Aliquam tempor justo in lorem mattis, in pharetra magna porttitor. Nulla mattis eget augue finibus aliquam. Quisque volutpat, ipsum et dictum volutpat, leo urna volutpat urna, vitae rutrum dolor metus vel ex.</Text>
                <Button
                  color='#ff66ff'
                  icon={<Icon name='code' color='#ffffff' />}
                  buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0, color: '#ff'}}
                  title='VIEW NOW' onPress={toggleOverlay}/>
        </Card>
        <Card>
          <Card.Title>POTATOES FOR SALE</Card.Title>
          <Card.Image source={require('./app/assets/potatoes.jpg')}/>
          <Card.Divider/>
                <Text style={{ marginBottom: 10}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam hendrerit pharetra sodales. In viverra risus vel elit efficitur mollis. Aliquam tempor justo in lorem mattis, in pharetra magna porttitor. Nulla mattis eget augue finibus aliquam. Quisque volutpat, ipsum et dictum volutpat, leo urna volutpat urna, vitae rutrum dolor metus vel ex.</Text>
                <Button
                  color='#ff66ff'
                  icon={<Icon name='code' color='#ffffff' />}
                  buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0, color: '#ff'}}
                  title='VIEW NOW' onPress={toggleOverlay}/>
        </Card>
        <Card>
          <Card.Title>FRESH PINEAPPLES</Card.Title>
          <Card.Image source={require('./app/assets/pineapples.jpg')}/>
          <Card.Divider/>
                <Text style={{ marginBottom: 10}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam hendrerit pharetra sodales. In viverra risus vel elit efficitur mollis. Aliquam tempor justo in lorem mattis, in pharetra magna porttitor. Nulla mattis eget augue finibus aliquam. Quisque volutpat, ipsum et dictum volutpat, leo urna volutpat urna, vitae rutrum dolor metus vel ex.</Text>
                <Button
                  color='#ff66ff'
                  icon={<Icon name='code' color='#ffffff' />}
                  buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0, color: '#ff'}}
                  title='VIEW NOW' onPress={toggleOverlay}/>
        </Card>
        <Card>
          <Card.Title>DELICOUS CUCUMBERS</Card.Title>
          <Card.Image source={require('./app/assets/cucumbers.jpg')}/>
          <Card.Divider/>
                <Text style={{ marginBottom: 10}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam hendrerit pharetra sodales. In viverra risus vel elit efficitur mollis. Aliquam tempor justo in lorem mattis, in pharetra magna porttitor. Nulla mattis eget augue finibus aliquam. Quisque volutpat, ipsum et dictum volutpat, leo urna volutpat urna, vitae rutrum dolor metus vel ex.</Text>
                <Button
                  color='#ff66ff'
                  icon={<Icon name='code' color='#ffffff' />}
                  buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0, color: '#ff'}}
                  title='VIEW NOW' onPress={toggleOverlay}/>
        </Card>
        
        <Text>TODO: add functionality to see current foods owned.</Text>
      </ScrollView>   
    </View>
  );
}
const Buy = ({navigation}) => { // buy page, user will be able to buy certain foods.
  return(
    <Text>Buy</Text>
  );
  
}
const Sell = ({navigation}) => { // sell page, user will be able to sell their OWNED foods.
  return(
    <Text>Sell</Text>
  );
}
const YourProfile = ({navigation}) => { // the users own profile, view username, cash, (change password?)
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');

  const changePassword = () => {
    if(password != passwordAgain)
    {
      Alert.alert('Invalid input', 'Passwords dont match!');
    }
    else{
      Alert.alert("Success", "Password updated");
    }
  }

  const toggleOverlay = () => {
    setVisible(!visible);
  }

  var user = firebase.auth().currentUser;
  var email;
  if (user != null) {
    email = user.email;
  }

  return(
    <View style={styles.yourProfileContent}>
      <Overlay isVisible={visible} onBackdropPress={toggleOverlay} fullScreen={true}>
        <View style={styles.yourProfileChangePassword}>
            <TextInput maxLength={20} secureTextEntry={true} style={styles.textInput} placeholder='Password' placeholderTextColor='#ff66ff'
            leftIcon={{ type: 'font-awesome', name: 'chevron-left' }} onChangeText={(password) => setPassword(password)} defaultValue={password}/>
            <TextInput style={styles.textInput} secureTextEntry={true} placeholderTextColor='#ff66ff' placeholder="Password-again"
            onChangeText={(passwordAgain) => setPasswordAgain(passwordAgain)} defaultValue={passwordAgain}/>
            <Button color='#ff66ff' title="CHANGE" onPress={changePassword}/>
            <Text style={styles.register} onPress={toggleOverlay}>Go back.</Text>
          </View>
      </Overlay>
      <MaterialCommunityIcons name="account-circle" color={'#ff66ff'} size={50}/>
      <Text style={{fontWeight: 'bold'}}>Your Email: {email}</Text>        
      <MaterialCommunityIcons name="lock" color={'#ff66ff'} size={50} style={{marginTop: 20}}/> 
      <Button title='CHANGE PASSWORD' color="#ff66ff" onPress={toggleOverlay}/>
      
    </View>
  );
}
export default function App() { // MAIN APP
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={headerBar}/>
        <Stack.Screen name="Register" component={Register} options={headerBar}/>
        <Stack.Screen name="Your Food MarketPlace" component={AppContent} options={headerBar} />
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
  },
  register: {
    paddingTop: 15,
    fontSize: 10,
    color: '#ff66ff',
    textDecorationLine: 'underline',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textDecorationStyle: 'dashed',
    color: '#ff66ff',
    paddingBottom: 20
  },
  yourProfileContent: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center', 
    justifyContent: 'center',
    alignContent: 'center',
  },
  yourProfileChangePassword: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});