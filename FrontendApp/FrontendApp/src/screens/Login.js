import React, { useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import {
  Layout,
  Text,
  TextInput,
  Button,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import { api } from "../configs/Api";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    try
    {
      // navigation.navigate('AlertScreen')
      setLoading(true);
      const body = {
          username: username,
          password: password
      }
      const response = await fetch(`${api}/login`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
      })
      const responseinjson = await response.json();
      console.log("responseinjson",responseinjson)
      if(responseinjson.data?.login)
      {
        setLoading(false);
        if(responseinjson.data.ispasswordtrue)
        {
          await AsyncStorage.setItem('AppStarted',JSON.stringify({isAppStarted:false}))
          await AsyncStorage.setItem('UserData',JSON.stringify({id:responseinjson.data.id,username:username}))
          navigation.navigate('MainTabs')
        }
        else
        {
          alert(responseinjson.data?.msg)
          setLoading(false);
        }
      }
      else
      {
        alert(responseinjson.data?.msg)
        setLoading(false);
      }
    }
    catch(err)
    {
      console.log("error: ",err)
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <Layout>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: isDarkmode ? "#17171E" : themeColor.white100,
            }}
          >
            <Image
              resizeMode="contain"
              style={{
                height: 220,
                width: 220,
              }}
              source={require("../../assets/login.png")}
            />
          </View>
          <View
            style={{
              flex: 3,
              paddingHorizontal: 20,
              paddingBottom: 20,
              backgroundColor: isDarkmode ? themeColor.dark : themeColor.white,
            }}
          >
            <Text
              fontWeight="bold"
              style={{
                alignSelf: "center",
                padding: 30,
              }}
              size="h3"
            >
              Login
            </Text>
            <Text>Username</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Enter your username"
              value={username}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              keyboardType="default"
              onChangeText={(text) => setUsername(text)}
            />

            <Text style={{ marginTop: 15 }}>Password</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Enter your password"
              value={password}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
            />
            <Button
              text={loading ? "Loading" : "Continue"}
              onPress={() => {
                login();
              }}
              color={themeColor.danger}
              style={{
                marginTop: 20
              }}
              disabled={loading}
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 15,
                justifyContent: "center",
              }}
            >
              <Text size="md">Don't have an account?</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Register");
                }}
              >
                <Text
                  size="md"
                  fontWeight="bold"
                  style={{
                    marginLeft: 5,
                  }}
                >
                  Register here
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 30,
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  isDarkmode ? setTheme("light") : setTheme("dark");
                }}
              >
                <Text
                  size="md"
                  fontWeight="bold"
                  style={{
                    marginLeft: 5,
                  }}
                >
                  {isDarkmode ? "☀️ light theme" : "🌑 dark theme"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
  );
}
