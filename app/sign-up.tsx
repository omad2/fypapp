import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  View,
  Alert,
} from "react-native";
import { auth } from "../FirebaseConfig"; // Ensure FirebaseConfig is set up
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { router } from "expo-router";

const SignUpScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Passwords Mismatch", "The passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      Alert.alert(
        "Sign-Up Successful",
        "A verification email has been sent. Please verify your email before logging in."
      );
      router.replace("/"); // Redirect to Login Screen
    } catch (error: any) {
      console.error(error);
      Alert.alert("Sign-Up Failed", error.message);
    }
  };

  const navigateToLogin = () => {
    router.push("/"); // Navigate back to Login Screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#757575"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#757575"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#757575"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        {/* Back to Login Button */}
        <TouchableOpacity style={styles.backButton} onPress={navigateToLogin}>
          <Text style={styles.backButtonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  form: { width: "90%", backgroundColor: "#1a1a1a", padding: 20, borderRadius: 10 },
  title: { fontSize: 28, fontWeight: "bold", color: "#B7E561", marginBottom: 20, textAlign: "center" },
  input: { width: "100%", backgroundColor: "#2b2b2b", color: "#FFF", padding: 15, borderRadius: 10, marginVertical: 10 },
  button: { backgroundColor: "#B7E561", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#000", fontSize: 18, fontWeight: "bold" },
  backButton: {
    marginTop: 10,
    padding: 15,
    borderWidth: 2,
    borderColor: "#B7E561",
    borderRadius: 10,
    alignItems: "center",
  },
  backButtonText: { color: "#B7E561", fontSize: 16, fontWeight: "600" },
});
