import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  View,
} from 'react-native';
import { auth } from '../FirebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { router } from 'expo-router';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (user) router.replace('/(tabs)');
    } catch (error: any) {
      console.error(error);
      alert('Sign in failed: ' + error.message);
    }
  };

  const signUp = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      if (user) router.replace('/(tabs)');
    } catch (error: any) {
      console.error(error);
      alert('Sign up failed: ' + error.message);
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
        <TouchableOpacity style={styles.button} onPress={signIn}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={signUp}>
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
    backgroundColor: '#000', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '90%',
    alignItems: 'center',
    backgroundColor: '#1a1a1a', 
    padding: 20,
    borderRadius: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#B7E561', 
    marginBottom: 20,
  },
  textInput: {
    width: '100%',
    height: 50,
    backgroundColor: '#2b2b2b', 
    color: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
    fontSize: 16,
  },
  button: {
    width: '100%',
    backgroundColor: '#B7E561', 
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#000', 
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#B7E561',
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryButtonText: {
    color: '#B7E561', 
    fontSize: 18,
    fontWeight: '600',
  },
});
