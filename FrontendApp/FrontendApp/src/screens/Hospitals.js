import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Layout, Text, useTheme, Button, themeColor, TextInput } from 'react-native-rapi-ui';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { api } from '../configs/Api';
import * as Linking from "expo-linking";
import { Portal,Dialog  } from 'react-native-paper';
import { KeyboardAvoidingView } from 'react-native';


export default function ({ navigation }) {
	const { isDarkmode, setTheme } = useTheme();
    const [isPlaying, setIsPlaying] = useState(false)
    const [UserData, SetUserData] = useState()
    const [HospitalsData, SetHospitalsData] = useState([])
    const [Hospitalname, setHospitalname] = useState("");
    const [Hospitalcontact, setHospitalcontact] = useState("");
    
    const [visible_hospital, setvisible_hospital] = useState(false);
    const showhospitalDialog = () => setvisible_hospital(true);
    const hidehospitalDialog = () => setvisible_hospital(false);
    
    const SubmitHospitalDetails = async () =>{
        console.log("Called: ")
        if(Hospitalname == "" || Hospitalcontact == "")
        {
            alert("Hospital Name and Phone both are required.")
        }
        else
        {
            const body = {
                id: UserData.id,
                hospitalname: Hospitalname,
                hospitalphone: Hospitalcontact
            }
            const response = await fetch(`${api}/addhospital`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
            const responseInJson = await response.json()
            if(responseInJson?.error)
            {
                alert("Some Issue Occured, Try again")
            }
            else
            {
                if(responseInJson?.data.isadded)
                {
                    // console.log("responseInJson?.data?.userdata: ",responseInJson)
                    setHospitalname("")
                    setHospitalcontact("")
                    SetHospitalsData(responseInJson.data.userdata)
                    hidehospitalDialog()
                }
                else
                {
                  alert(responseInJson.data.msg)
                }
            }
        }
    }

    const DeleteContact = async (id) =>{
        const body = {
            id: id,
            userid: UserData.id
        }
        const response = await fetch(`${api}/deletehospital`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        const responseInJson = await response.json()
        if(responseInJson?.error)
        {
            alert("Some Issue Occured, Try again")
        }
        else
        {
            console.log("responseInJson?.data?.userdata: ",responseInJson)
            SetHospitalsData(responseInJson.data.userdata)
        }
    }

    const getAllSavedHospitals = async () =>{
        console.log("Called: ")
        const value = await AsyncStorage.getItem('UserData')
        const ValueInJson = JSON.parse(value)
        if(ValueInJson !== null) {
            const body = {
                id: ValueInJson.id
            }
            console.log("body: ",body)
            SetUserData(ValueInJson)
            const response = await fetch(`${api}/getallhospitals`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
            const responseInJson = await response.json()
            if(responseInJson?.error)
            {
                alert("Some Issue Occured, Try again")
            }
            else
            {
                console.log("responseInJson?.data?.userdata: ",responseInJson)
                SetHospitalsData(responseInJson.data.userdata)
            }
            console.log("responseInJson: ",responseInJson)
        }
    }

    useEffect(() => {

        getAllSavedHospitals()

    }, []);
    
	return (
		<Layout style={{flex:1}}>
			<View
				style={{
                    marginLeft:15,
                    marginRight:15,
                    marginTop:'15%',
                    display:'flex',
                    flexDirection:'row'
				}}
			>
                <Text
                    style={{
                        fontSize:25,
                        fontWeight:'bold',
                        marginBottom:20
                    }}
                >
                    {"Hospitals"}
                </Text>
                <TouchableOpacity
                    style={{
                        display:'flex',
                        marginLeft:'auto'
                    }}
                    onPress={()=>{
                        showhospitalDialog();
                    }}
                >
                    <MaterialCommunityIcons color={themeColor.danger} style={{marginBottom:'auto'}} name="plus" size={40} />       
                </TouchableOpacity>
			</View>
			{/* <View
				style={{
                    width:'90%',
                    marginLeft:'auto',
                    marginRight:'auto'
				}}
			>
                <TextInput
                    containerStyle={{ marginTop: 15, marginBottom: 15 }}
                    placeholder="Enter your emergency contact"
                    value={emergencycontact}
                    autoCapitalize="none"
                    autoCompleteType="off"
                    autoCorrect={false}
                    keyboardType="phone-pad"
                    onChangeText={(text) => setEmergencycontact(text)}
                />
                <TouchableOpacity
                    style={{
                        backgroundColor:themeColor.primary,
                        borderRadius:10,
                        display:'flex',
                        flexDirection:'row',
                        justifyContent:'center',
                        padding:15,
                        marginLeft:'auto',
                        marginRight:'auto'
                    }}
                    onPress={()=>{
                        if(emergencycontact.length == 11)
                        {
                            // ok
                            addEmergencyContact()
                        }
                        else
                        {
                            alert("Phone number should be of 11 digits and in format of 0312*******")
                        }
                    }}
                >
                    <Text
                        style={{color:themeColor.white,fontSize:18,fontWeight:'700',marginTop:'auto',marginBottom:'auto'}}
                    >
                        {"Add Contact"}
                    </Text>
                    <MaterialCommunityIcons color={themeColor.white} style={{marginLeft:10,marginTop:'auto',marginBottom:'auto'}} name="plus" size={20} />       
                </TouchableOpacity>
			</View> */}
            
			<ScrollView
                style={{
                    marginTop:30,
                    marginBottom:30
                }}
			>
                {HospitalsData?.map((data,index)=>(
                    <View style={{width:'90%',padding:20,borderWidth:1,borderColor:themeColor.gray,
                                marginLeft:'auto',marginRight:'auto',borderRadius:20,display:'flex',
                                marginTop:20,flexDirection:'column'}} key={index}>
                        
                        <View
                            style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: isDarkmode ? "#17171E" : themeColor.white100,
                            }}
                        >
                            
                        <TouchableOpacity
                            style={{
                                borderRadius:10,
                                display:'flex',
                                flexDirection:'row',
                                padding:5,
                                marginLeft:'auto',
                                borderWidth:1,
                                borderColor:themeColor.danger
                            }}
                            onPress={()=>{
                                Alert.alert('Confirmation', 'Are you sure, you want to delete this hospital details?', [
                                    {
                                      text: 'Cancel',
                                      style: 'cancel',
                                    },
                                    {text: 'Yes', onPress: () => DeleteContact(data.id)},
                                ]);                              
                            }}
                        >
                            <MaterialCommunityIcons color={themeColor.danger} style={{marginTop:'auto',marginBottom:'auto'}} name="minus" size={30} />       
                        </TouchableOpacity>
                        <Image
                            resizeMode="contain"
                            style={{
                                height: 70,
                            }}
                            source={require("../../assets/hospital.png")}
                        />
                        </View>
                        <Text style={{color:isDarkmode ? themeColor.white : themeColor.black,fontWeight:'bold',textAlign:'center',marginTop:20,marginBottom:20,fontSize:20}}>
                            {/* {data.phone} */}
                            {`Name: ${data.name}`}
                        </Text>
                        <View
                            style={{
                                display:'flex',
                                flexDirection:'row'
                            }}
                        >
                            <View
                                style={{
                                    display:'flex',
                                    flexDirection:'row',
                                    marginLeft:'auto',
                                    marginRight:'auto'
                                }}
                            >
                                <TouchableOpacity
                                    style={{
                                        borderRadius:10,
                                        padding:15,
                                        display:'flex',
                                        flexDirection:'row',
                                    }}
                                    onPress={()=>{
                                        Linking.openURL(`tel:${data.phone}`)                            
                                    }}
                                >
                                    <FontAwesome color={"#006400"} style={{marginLeft:10,marginTop:'auto',marginBottom:'auto'}} name="phone" size={30} />        
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                    </View>
                ))}
                {/* {HospitalsData?.map((data,index)=>(
                    <View style={{width:'90%',padding:10,borderWidth:1,borderColor:themeColor.primary,marginLeft:'auto',marginRight:'auto',borderRadius:10,display:'flex',flexDirection:'row'}} key={index}>
                        <Text style={{color:isDarkmode ? themeColor.white : themeColor.black,textAlign:'center',marginTop:'auto',marginBottom:'auto'}}>
                            {data.phone}
                        </Text>
                        <TouchableOpacity
                            style={{
                                backgroundColor:themeColor.danger,
                                borderRadius:10,
                                display:'flex',
                                flexDirection:'row',
                                padding:15,
                                marginLeft:'auto'
                            }}
                            onPress={()=>{
                                Alert.alert('Confirmation', 'Are you sure, you want to delete this number?', [
                                    {
                                      text: 'Cancel',
                                      style: 'cancel',
                                    },
                                    {text: 'Yes', onPress: () => DeleteContact(data.id)},
                                ]);                              
                            }}
                        >
                            <Text
                                style={{color:themeColor.white,fontSize:18,fontWeight:'700',marginTop:'auto',marginBottom:'auto'}}
                            >
                                {"Delete"}
                            </Text>
                            <MaterialCommunityIcons color={themeColor.white} style={{marginLeft:10,marginTop:'auto',marginBottom:'auto'}} name="minus" size={20} />       
                        </TouchableOpacity>
                        
                    </View>
                ))} */}
			</ScrollView>
            
            {/* All Hospital List Dialog */}
            <Portal>
                <Dialog style={{borderRadius:10,paddingBottom:20}} visible={visible_hospital} onDismiss={hidehospitalDialog}>
                
                <View
                    style={{
                        display:'flex',
                        flexDirection:'row',
                        marginBottom:10
                    }}
                >
                    <Dialog.Title
                        style={{
                            marginRight:'auto'
                        }}
                    >
                        {"Add Hospital"}
                    </Dialog.Title>
                    <TouchableOpacity
                        onPress={SubmitHospitalDetails}
                        style={{
                            backgroundColor:themeColor.primary,
                            padding:20,
                            marginLeft:'auto',
                            marginRight:20,
                            borderRadius:10,
                        }}
                    >
                    <Text
                        style={{
                            color:themeColor.white,
                            textAlign:'center',
                            marginTop:'auto',
                            marginBottom:'auto'
                        }}
                    >
                        {"Add"}
                    </Text>
                    </TouchableOpacity>
                </View>
                <KeyboardAvoidingView>
                    <Dialog.ScrollArea>
                        <Text
                            style={{
                                color:themeColor.white,
                                textAlign:'left',
                                marginTop:20
                            }}
                        >
                            {"Hospital name"}
                        </Text>
                        <TextInput
                            containerStyle={{ marginTop: 15, marginBottom: 15 }}
                            placeholder="Enter your emergency contact"
                            value={Hospitalname}
                            autoCapitalize="none"
                            autoCompleteType="off"
                            autoCorrect={false}
                            keyboardType="default"
                            onChangeText={(text) => setHospitalname(text)}
                        />
                        <Text
                            style={{
                                color:themeColor.white,
                                textAlign:'left',
                                marginTop:20
                            }}
                        >
                            {"Hospital contact number"}
                        </Text>
                        <TextInput
                            containerStyle={{ marginTop: 15, marginBottom: 15 }}
                            placeholder="Enter your emergency contact"
                            value={Hospitalcontact}
                            autoCapitalize="none"
                            autoCompleteType="off"
                            autoCorrect={false}
                            keyboardType="phone-pad"
                            onChangeText={(text) => setHospitalcontact(text)}
                        />
                    </Dialog.ScrollArea>
                    {/* <Dialog.Actions>
                    </Dialog.Actions> */}
                </KeyboardAvoidingView>
                </Dialog>
            </Portal>
		</Layout>
	);
}
