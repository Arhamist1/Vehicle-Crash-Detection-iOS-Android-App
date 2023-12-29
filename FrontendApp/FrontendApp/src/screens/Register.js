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
import { api } from "../configs/Api"
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emergencycontact, setEmergencycontact] = useState("");
  const [loading, setLoading] = useState(false);

  async function register() {
    try
    {
        setLoading(true);
        const body = {
            username: username,
            password: password,
            emergencycontact: emergencycontact
        }
        const response = await fetch(`${api}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        const responseinjson = await response.json();
        setLoading(false);
        if(responseinjson.data?.signedUp)
        {
          await AsyncStorage.setItem('UserData',JSON.stringify({id:responseinjson.data.id,username:username}))
          navigation.navigate('MainTabs')
        }
        else
        {
          alert(responseinjson.data?.msg)
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
              source={require("../../assets/register.png")}
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
              size="h3"
              style={{
                alignSelf: "center",
                padding: 30,
              }}
            >
              Register
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
            <Text style={{ marginTop: 15 }}>Emergency Contact</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Enter your emergency contact"
              value={emergencycontact}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              keyboardType="phone-pad"
              onChangeText={(text) => setEmergencycontact(text)}
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
              text={loading ? "Loading" : "Create an account"}
              onPress={() => {
                register();
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
              <Text size="md">Already have an account?</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Login");
                }}
              >
                <Text
                  size="md"
                  fontWeight="bold"
                  style={{
                    marginLeft: 5,
                  }}
                >
                  Login here
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
