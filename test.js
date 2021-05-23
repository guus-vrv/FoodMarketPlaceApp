import { render } from "react-dom";
import { ThemeConsumer } from "react-native-elements";

class Index extends Component { // index page mananger, when user clicks login he arrives here
    constructor(props) {
        super(props);
        this.state = {
            posts: []
        };
    }
    
    getPost() {
        db.collection("posts").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                
                console.log(doc.data().title, " => ", doc.data().description);
                this.state.posts.push([doc.data().title, doc.data().price, doc.data().description]);
                
            /*
            posts = post.map((p) => 
            <Card>
            <Card.Title>{p.title}</Card.Title>
            <Card.Image source={require('./app/assets/apple.jpg')}/>
            <Card.Divider/>
                <Text>{p.price}</Text>
                <Text>{p.description}</Text>
                <Button
                color='#ff66ff'
                icon={<Icon name='code' color='#ffffff' />}
                buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0, color: '#ff'}}
                title='VIEW'/>
            </Card>
            );
            */
            
            });
        });
    }
    
    doStuff() {
        this.setState(prevState => ({
            posts: prevState.posts = posts
        }));
        console.log(this.state.posts);
    }

    // array of card objects -> create long scrollview
  
    render() {
        return (
            <View>
                {this.getPost}
                {this.doStuff}
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.titleHomepage} onPress={() => console.log(posts)}>FOOD LISTINGS</Text>
                <Divider style={styles.dividerHomepage} />
                <Text>test</Text>
                <Text style={styles.titleHomepage}>YOUR MARKETPLACE</Text>
                <Divider style={styles.dividerHomepage} />
                <Text>Todays date: {today}</Text>
                <Text>Amount of purchases: {purchases}</Text>
                <Text>Currently owned foods: 1</Text>
                <Text>Current cash amount: €10000</Text>
              </ScrollView>   
        
            </View>
          );
    }

}    