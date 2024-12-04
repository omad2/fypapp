import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  View,
  Alert,
} from "react-native";
import { auth } from "../FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { router } from "expo-router";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter your email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if email is verified
      if (user.emailVerified) {
        router.replace("/home"); // Redirect to tabs after successful login
      } else {
        Alert.alert(
          "Email Not Verified",
          "Please verify your email before logging in. Check your inbox for the verification link."
        );
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          placeholderTextColor="#757575"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          placeholderTextColor="#757575"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/sign-up")}
        >
          <Text style={styles.secondaryButtonText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "90%",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#B7E561",
    marginBottom: 20,
  },
  textInput: {
    width: "100%",
    height: 50,
    backgroundColor: "#2b2b2b",
    color: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
    fontSize: 16,
  },
  button: {
    width: "100%",
    backgroundColor: "#B7E561",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
  },
  secondaryButton: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#B7E561",
    alignItems: "center",
    marginTop: 10,
  },
  secondaryButtonText: {
    color: "#B7E561",
    fontSize: 18,
    fontWeight: "600",
  },
});
