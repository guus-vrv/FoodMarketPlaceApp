import { setStatusBarNetworkActivityIndicatorVisible, StatusBar } from 'expo-status-bar';
import React, { Component, useState, useEffect, version } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TextInput, Button, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator, HeaderStyleInterpolators} from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import  MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from './firebaseConfig';
import 'react-native-gesture-handler';
import { Card, ListItem, Icon, Overlay, Divider, SearchBar } from 'react-native-elements';
import LottieView from 'lottie-react-native';
import {List} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import Fire from './Fire.js';
const Stack = createStackNavigator(); // manage page navigation login -> home
const Tab = createMaterialBottomTabNavigator(); // bottom page navigator for content in the app
import { showMessage, hideMessage} from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";


var db = firebase.firestore(); // Initialize firebase firestore database

class Register extends Component { // Register class, manage text input using state and a constructor
   constructor(props) {
     super(props);
     this.state = {
       email: '',
       password: ''
     }
   }

   showMessage() {
     showMessage({
       message: "Successfully registered user!",
       type: "success"
     })
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
      this.props.navigation.navigate('Login', {message: true});
      firebase.auth().createUserWithEmailAndPassword(email, password).then((userCredential) => {
        return db.collection('users').doc(userCredential.user.uid).set({
          // potential stats -> purchases 
          purchases: 0
          
        });
      
      }).catch((error) => {
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
      <Tab.Screen name="Sell" component={Sell} options={{tabBarIcon: 
        ({color}) => (
          <MaterialCommunityIcons name="cash" color={color} size={26} />
        )
      }} />
      <Tab.Screen name="Your listings" component={YourListings} options={{tabBarIcon: 
        ({color}) => (
          <MaterialCommunityIcons name="clipboard-check-outline" color={color} size={26} />
        )
      }} />
      <Tab.Screen name="Your account" component={YourAccount} options={{tabBarIcon: 
        ({color}) => (
          <MaterialCommunityIcons name="account-circle" color={color} size={26} />
        )
      }} />
    </Tab.Navigator>
  );
}
class Index extends Component { // index page mananger, when user clicks login he arrives here
  constructor(props) {
      super(props);
      this.state = {
          posts: [],
              
      };
      // bind functions for setState
      this.getPost = this.getPost.bind(this);
  }
  
  componentDidMount() {
    this.getPost();
  }

  getPost() {
    let user = firebase.auth().currentUser;
    db.collection("posts").where('postId', '!=', user.uid).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, '=> ID');
            const newPost = [];
            newPost.push({
              title: doc.data().title, 
              price: doc.data().price, 
              description: doc.data().description,
              image: doc.data().image,
              postId: doc.data().postId, 
              id: doc.id
              // USER ID FOR EVERY POST
            });
            this.setState(prevState => ({
              posts: [newPost, ...prevState.posts]
            }));
        
        });
    });



  }
  
  viewPost = (id) => {
    this.props.navigation.navigate('View Post', {id: id});
  }
  // array of card objects -> create long scrollview

  render() {
      const Posts = this.state.posts.map((array) => {
          let images = String((array.map((a) => a.image))); // Dynamically set every picture to a post.
          return <Card>
          <Card.Title style={{fontWeight: 'bold'}}>{array.map((a)=> a.title)}</Card.Title> 
          <Card.Divider/>
          {images ? <Card.Image source={{uri: images}}></Card.Image> : <Card.Image source={require('./app/assets/noimage.png')}></Card.Image>}
          <Text style={styles.cardText, {textAlign: 'center', paddingTop: 5}}>Price: ${array.map((a)=> a.price)}</Text>
          <Text style={styles.cardText}>{array.map((a)=> a.description)}</Text>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity style={styles.viewButton} onPress={() => this.viewPost(array.map((a) => a.id))}>
            <Text style={styles.viewText}>VIEW</Text>
          </TouchableOpacity>
          </View>
          </Card>
        }).reverse();
      
      return (
          <View style={{flex: 1}}>
            <Text style={styles.titleHomepage} onPress={() => console.log(this.state.posts)}>FOOD LISTINGS</Text>
            <Divider style={styles.dividerHomepage} />
            <ScrollView showsVerticalScrollIndicator={false}>
              <View>{Posts}</View>
            </ScrollView>  
          </View>
        );
  }

}    

const Sell = ({navigation}) => { // sell page, user will be able to sell their OWNED foods.
  let [visible, setVisible] = useState(false);
  const [image, setImage] = useState(null);
  let [title, setTitle] = useState('');
  let [price, setPrice] = useState('');
  let [imageUri, setImageUri] = useState('');
  let [description, setDescription] = useState('');

  const handlePost = () => {
    try {
      price = parseInt(price);
      let user = firebase.auth().currentUser;
      db.collection('posts').doc().set({
        title: title,
        price: price,
        description: description,
        image: image,
        postId: String(user.uid)
        
      }).then(() => {
        toggleOverlay();
      }).catch(error => {
        alert(error);
      })
    }
    catch (error){
      Alert.alert(error);
    }
  }

  const toggleOverlay = () => {
    setVisible(!visible);
  }


  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1
    });
    if(pickerResult.cancelled === true) {
      return;
    }
    setImage(pickerResult.uri);
  }

  return(
    <View style={styles.yourAccountContent}>
      <Overlay isVisible={visible} onBackdropPress={toggleOverlay} fullScreen={true}>
        <View style={styles.yourAccountChangePassword}>
            <TouchableOpacity style={{marginBottom: 50}} onPress={openImagePickerAsync}>
              <MaterialCommunityIcons name='camera' size={50} color='#ff66ff'/>
            </TouchableOpacity>
            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginBottom: 50 }} />}
            <View style={{flexDirection: 'row'}}> 
              <MaterialCommunityIcons name='pencil' size={20} color='#ff66ff' style={styles.sellIcons}/>
              <TextInput maxLength={20} style={styles.textInputSell} placeholder='Title' placeholderTextColor='#ff66ff' maxLength={20}
                    onChangeText={(title) => setTitle(title)} defaultValue={title}/>
            </View>
            <View style={{flexDirection: 'row'}}> 
              <MaterialCommunityIcons name='cash' size={20} color='#ff66ff' style={styles.sellIcons}/>
              <TextInput style={styles.textInputSell} placeholderTextColor='#ff66ff' placeholder="Price (dollars)"
                    onChangeText={(price) => setPrice(price)} defaultValue={price}   />
            </View>
            <View style={{flexDirection: 'row'}}> 
              <MaterialCommunityIcons name='book' size={20} color='#ff66ff' style={styles.sellIcons}/>
              <TextInput style={styles.textInputSell} placeholderTextColor='#ff66ff' placeholder="Description" maxLength={1000} multiline={true}
                     onChangeText={(description) => setDescription(description)} defaultValue={description}/>
            </View>
            <Button color='#ff66ff' title="POST" onPress={handlePost}/>
            <Text style={styles.register} onPress={toggleOverlay}>Go back.</Text>
          </View>
      </Overlay>
      <Text style={{textAlign: 'center', fontSize: 20, fontWeight:'bold', marginBottom: 5, color: '#ff66ff'}}>Create new listing</Text>
      <TouchableOpacity style={styles.addListing} onPress={toggleOverlay}>
        <Text style={{color: 'white', fontSize: 30}}>+</Text>
      </TouchableOpacity>
      
    </View>

  );
}

class YourListings extends Component {
  constructor(props){
    super(props);
    this.state = {
      yourPosts: []
    }
    this.getYourPosts = this.getYourPosts.bind(this)
  }

  componentDidMount() {
    this.getYourPosts();
  }

  editPost = (id) => {
    this.props.navigation.navigate('Edit Post', {id: id});
  }

  getYourPosts() {
    let user = firebase.auth().currentUser;
    db.collection("posts").where("postId", "==", user.uid).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
          const newPosts = [];
          newPosts.push({
            title: doc.data().title, 
            price: doc.data().price, 
            description: doc.data().description,
            image: doc.data().image,
            postId: doc.data().postId, 
            id: doc.id
            // USER ID FOR EVERY POST
          });
          this.setState(prevState => ({
            yourPosts: [newPosts, ...prevState.yourPosts]
          }));
      
      });
  });
  }

  render() {
    let yourPosts = this.state.yourPosts.map((array) => {
      let images = String((array.map((a) => a.image))); // Dynamically set every picture to a post.
      return <Card>
      <Card.Title style={{fontWeight: 'bold'}}>{array.map((a)=> a.title)}</Card.Title> 
      <Card.Divider/>
      {images ? <Card.Image source={{uri: images}}></Card.Image> : <Card.Image source={require('./app/assets/noimage.png')}></Card.Image>}
      <Text style={styles.cardText, {textAlign: 'center', paddingTop: 5}}>Price: ${array.map((a)=> a.price)}</Text>
      <Text style={styles.cardText}>{array.map((a)=> a.description)}</Text>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TouchableOpacity style={styles.viewButton} onPress={() => this.editPost(array.map((a) => a.id))}>
        <Text style={styles.viewText}>EDIT</Text>
      </TouchableOpacity>
      </View>
      </Card>
    });
    
    return (
      <ScrollView>
        {yourPosts}
      </ScrollView>
    );
  }
}

const YourAccount = ({navigation}) => { // the users own profile, view username, cash, (change password?)
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');

  const changePassword = () => {
    if(password != passwordAgain)
    {
      Alert.alert('Invalid input', 'Passwords dont match!');
    }
    else{
      // get password from input
      let user = firebase.auth().currentUser;
      user.updatePassword(password).then(function() {
        toggleOverlay();
      }).catch(function(error) {
        Alert.alert('Error', 'An error occured please try again.');
        console.log(error);
      });
    }
  }



  const toggleOverlay = () => {
    setVisible(!visible);
  }

  const signOut = () => {
    firebase.auth().signOut().then(() => {   
      navigation.navigate('Login')
      

    }).catch((err) => {
      Alert.alert(err);
    })
  }
  

  var user = firebase.auth().currentUser;
  var email;
  if (user != null) {
    email = user.email;
  }

  return(
    <View style={styles.yourAccountContent}>
      <Overlay isVisible={visible} onBackdropPress={toggleOverlay} fullScreen={true}>
        <View style={styles.yourAccountChangePassword}>
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
      <Button style={{marginBottom: 20}}title='CHANGE PASSWORD' color="#ff66ff" onPress={toggleOverlay}/>
      
      <Button title='LOGOUT' color="#ff66ff" onPress={signOut}/>
    </View>
    
  );
}

class ViewPost extends Component {
  constructor(props) {
      super(props);
      this.state = {
          currentPost: [],
      }
      this.getPost = this.getPost.bind(this);
  }

  componentDidMount() {
    this.getPost();
  }

  getPost() {
    db.collection('posts').where(firebase.firestore.FieldPath.documentId(), '==', String(this.props.route.params.id)).get().then((querySnapshot) => { 
      if(!(querySnapshot.empty))
      {
        querySnapshot.forEach((doc) => {
            doc.data().title ? doc.data().title : console.log('no')
            let viewpost = [];
            viewpost.push({
            title: doc.data().title,
            image: doc.data().image,
            price: doc.data().price,
            description: doc.data().description
            });
            this.setState({
              currentPost: viewpost
            });
      
        })
      }
    });
    
  }

  render() {
    let currentPost = this.state.currentPost.map((element) => {
      let images = element.image;
      return <Card>
      <Card.Title style={{fontWeight: 'bold'}}>{element.title}</Card.Title> 
      <Card.Divider/>
      {images ? <Card.Image source={{uri: images}}></Card.Image> : <Card.Image source={require('./app/assets/noimage.png')}></Card.Image>}
      <Text style={styles.cardText, {textAlign: 'center', paddingTop: 5}}>Price: ${element.price}</Text>
      <Text style={styles.cardText}>{element.description}</Text>
      <View style={{justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}}>
        <TouchableOpacity style={styles.goBack} onPress={() => this.props.navigation.navigate('Your Food MarketPlace')}>
            <Text style={styles.viewText}>Go back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.viewButton} onPress={() => {
          showMessage({
            message: 'Message sent.',
            type: 'success'
          });
        }}>
          <Text style={styles.viewText}>Im interested.</Text>
        </TouchableOpacity>
      </View>
      </Card>
    })
    return(
      <View>
        <FlashMessage position="top" />
        <ScrollView >{currentPost}</ScrollView>
      </View>
    );
  }
}

class EditPost extends Component {
  constructor(props) {
      super(props);
      this.state = {
          currentPost: [],
          visible: false,
          title: "",
          price: "",
          description: "",
      }
      this.getPost = this.getPost.bind(this);
  }

  componentDidMount() {
    this.getPost();
  }

  toggleOverlay(){
    this.setState({
      visible: !visible,
    })
  }

  handlePost(){
    try {
      price = parseInt(price);
      let user = firebase.auth().currentUser;
      db.collection('posts').doc().set({
        title: title,
        price: price,
        description: description,
        image: image,
        postId: String(user.uid)
        
      }).then(() => {
        toggleOverlay();
      }).catch(error => {
        alert(error);
      })
    }
    catch (error){
      Alert.alert(error);
    }
  }

  openImagePickerAsync(){
    let permissionResult = ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1
    });
    if(pickerResult.cancelled === true) {
      return;
    }
    setImage(pickerResult.uri);
  }

  getPost() {
    db.collection('posts').where(firebase.firestore.FieldPath.documentId(), '==', String(this.props.route.params.id)).get().then((querySnapshot) => { 
      if(!(querySnapshot.empty))
      {
        querySnapshot.forEach((doc) => {
            doc.data().title ? doc.data().title : console.log('no')
            let viewpost = [];
            viewpost.push({
            title: doc.data().title,
            image: doc.data().image,
            price: doc.data().price,
            description: doc.data().description
            });
            this.setState({
              currentPost: viewpost
            });
      
        })
      }
    });
    
  }

  render() {
    let currentPost = this.state.currentPost.map((element) => {
      let images = element.image;
      return <View>
        <View style={styles.yourAccountChangePassword}>
        <TouchableOpacity style={{marginBottom: 50}} onPress={this.openImagePickerAsync}>
          <MaterialCommunityIcons name='camera' size={50} color='#ff66ff'/>
        </TouchableOpacity>
        {images && <Image source={{ uri: images }} style={{ width: 200, height: 200, marginBottom: 50 }} />}
        <View style={{flexDirection: 'row'}}> 
          <MaterialCommunityIcons name='pencil' size={20} color='#ff66ff' style={styles.sellIcons}/>
          <TextInput maxLength={20} style={styles.textInputSell} placeholder='Title' placeholderTextColor='#ff66ff' maxLength={20}
                onChangeText={(title) => this.setState({title: title})} defaultValue={this.state.title}/>
        </View>
        <View style={{flexDirection: 'row'}}> 
          <MaterialCommunityIcons name='cash' size={20} color='#ff66ff' style={styles.sellIcons}/>
          <TextInput style={styles.textInputSell} placeholderTextColor='#ff66ff' placeholder="Price (dollars)"
                onChangeText={(price) => this.setState({price: price})} defaultValue={this.state.price}   />
        </View>
        <View style={{flexDirection: 'row'}}> 
          <MaterialCommunityIcons name='book' size={20} color='#ff66ff' style={styles.sellIcons}/>
          <TextInput style={styles.textInputSell} placeholderTextColor='#ff66ff' placeholder="Description" maxLength={1000} multiline={true}
                onChangeText={(description) => this.setState({description: description})} defaultValue={this.state.description}/>
        </View>
        </View>
        <View style={{justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}}>
          <TouchableOpacity style={styles.goBack} onPress={() => this.props.navigation.navigate('Your Food MarketPlace')}>
              <Text style={styles.viewText}>Go back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.viewButton} onPress={() => {
            showMessage({
              message: 'Post Saved.',
              type: 'success'
            });
            this.handlePost();
          }}>
            <Text style={styles.viewText}>SAVE</Text>
          </TouchableOpacity>
        </View>
      </View>
    })
    return(
      <View>
        <FlashMessage position="top" />
        <ScrollView >{currentPost}</ScrollView>
      </View>
    );
  }
}

export default function App() { // MAIN APP
  /*
  let [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 5000)
  }, [])

  if(loading)
  {
    return(
      <LottieView source={require('./app/assets/24703-food-animation.json')} autoPlay loop resizeMode='contain'/>
    );
  }
  */
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={headerBar}/>
        <Stack.Screen name="Register" component={Register} options={headerBar}/>
        <Stack.Screen name="Your Food MarketPlace" component={AppContent} options={headerBar} />
        <Stack.Screen name="View Post" component={ViewPost} options={headerBar}/>
        <Stack.Screen name="Edit Post" component={EditPost} options={headerBar}/>
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
  textInputSell: {
    backgroundColor: '#6ECC77',
    width: 300,
    borderRadius: 20,
    height: 40,
    marginBottom: 20,
    textAlign: 'center',
    marginRight: 20
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
  yourAccountContent: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center', 
    justifyContent: 'center',
    alignContent: 'center',
  },
  yourAccountChangePassword: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  changeAmountBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    padding: 20,
    marginLeft: 20

  },
  changeAmount: {
    width: '20%'
  },
  dividerHomepage: {
    backgroundColor: '#ff66ff',
    height: 2
  },
  titleHomepage: {
    padding: 15,
    fontSize: 20, 
    fontWeight: 'bold'
  },
  buttonStyle: {
    borderRadius: 20,
    width: 20,
  },
  addListing: {
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    alignItems:'center',
    justifyContent:'center',
    width:100,
    height:100,
    backgroundColor:'#6ECC77',
    borderRadius:100,
    textAlign: 'center'
  },
  sellPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  sellIcons: {
    paddingTop: 10,
    paddingRight: 5
  },
  viewButton: {
    backgroundColor: '#ff66ff',
    color: 'white',
    padding: 10,
    borderRadius: 20,
    width: '35%',
    alignItems: 'center' 
  },
  viewText: {
    color: 'white',
    fontSize: 13,
    padding: 2, 
    fontWeight: 'bold'
  },
  cardText: {
    padding: 5,
    fontSize: 14,
  },
  goBack: {
    backgroundColor: '#B2BABB',
    color: 'white',
    padding: 10,
    borderRadius: 20,
    width: '35%',
    alignItems: 'center' 
  },
  likeImage: {
    height: 80,
    width: 80,


  }

});