import React from 'react';
import { StyleSheet, Text, View,SafeAreaView, ScrollView } from 'react-native';
import * as firebase from 'firebase';
import {firebaseConfig} from './config';
import {Item, Input, Label ,Button, List,ListItem} from 'native-base';
import Constant from 'expo-constants';

firebase.initializeApp(firebaseConfig)

export default class App extends React.Component{
  state = {
    text:"",
    mylist:[]
  }
  componentDidMount(){
    const myitems = firebase.database().ref("wishes");
    myitems.on("value",datasnap=>{

      if(datasnap.val()){
         //console.log(Object.values(datasnap.val()))
      this.setState({mylist:Object.values(datasnap.val())})

      }
     
    })
  }
  saveitem(){
    //console.log(this.state.text)

    const mywishes = firebase.database().ref("wishes");
    mywishes.push().set({
      text:this.state.text,
      time:Date.now()
    })
    this.setState({"text":""})

  }

  removeIt(){
    firebase.database().ref("wishes").remove()
    this.setState({mylist:[{text:"Removed Successfully"}]})

  }
  render(){

    console.log(this.state)
    const myitems = this.state.mylist.map(item=>{
      return(
        <ListItem style={{justifyContent:"space-between"}} key={item.time}>
            <Text>{item.text}</Text>
            <Text>{new Date(item.time).toDateString()}</Text>
            
        </ListItem>

      )
    })

    return (
      <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
         <Item fixedLabel>
                <Label>Add Items</Label>
                <Input 
                  value={this.state.text}
                  onChangeText={(text)=>this.setState({text})}
                />
                
          </Item>
          <View style={{flexDirection:"row",justifyContent:"space-around",padding:20}}>
            <Button rounded success
             style={styles.btn}
            onPress={()=>this.saveitem()}
             >
              <Text style={styles.text}> Add </Text>
            </Button>
            <Button rounded danger style={styles.btn}
              onPress={()=>this.removeIt()}
            >
              <Text style={styles.text}> Delete All </Text>
            </Button>
          </View>

          <List>
            {myitems}
          </List>



      </View>
      </ScrollView>
    </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop:Constant.statusBarHeight

  },
  btn:{
    padding:10,
    width:120,
    justifyContent:"center"
  },
  text:{
    color:"white",
    fontSize:18
  },
});
