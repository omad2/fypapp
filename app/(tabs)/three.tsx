import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Image,
  FlatList,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  Text,
  TextInput,
  View,
  ScrollView,
} from "react-native";
import { storage, auth } from "../../FirebaseConfig";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  listAll,
  deleteObject,
} from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { User } from "firebase/auth";

export default function TabThreeScreen() {
  const [image, setImage] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const [currentStep, setCurrentStep] = useState(0); // To track the current step
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [address, setAddress] = useState({
    line1: "",
    line2: "",
    city: "",
    eircode: "",
    country: "",
    status: "Pending", // Default status
  });

  const categories = ["Graffiti", "Potholes", "Litter", "Broken Infrastructure"];

  const fetchImages = async (userId: any) => {
    try {
      const storageRef = ref(storage, `images/${userId}`);
      const result = await listAll(storageRef);
      const urls = await Promise.all(
        result.items.map((itemRef) => getDownloadURL(itemRef))
      );
      setImages(urls);
    } catch (error) {
      console.error("Error fetching images: ", error);
    }
  };

  const deleteImage = async (url: any) => {
    if (!user) {
      console.warn("No user found!");
      return;
    }

    try {
      const storageRef = ref(storage, url);
      await deleteObject(storageRef);
      fetchImages(user.uid); // Refresh images after deletion
      setImages(images.filter((img) => img !== url));
    } catch (error: any) {
      console.error("Error deleting image: ", error);
      console.warn("Delete failed:", error.message);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      setImage(imageUri);
      setCurrentStep(1); 
    }
  };

  const uploadImage = async () => {
    if (
      !user ||
      !image ||
      !description ||
      !category ||
      !address.line1 ||
      !address.city ||
      !address.country
    ) {
      Alert.alert(
        "Missing Information",
        "Please provide all required details before uploading."
      );
      return;
    }

    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const storageRef = ref(storage, `images/${user.uid}/${Date.now()}`);
      await uploadBytes(storageRef, blob);

      const url = await getDownloadURL(storageRef);
      setImages((images) => [...images, url]);

      // Reset states
      setImage(null);
      setDescription("");
      setCategory("");
      setAddress({
        line1: "",
        line2: "",
        city: "",
        eircode: "",
        country: "",
        status: "Pending",
      });
      setCurrentStep(0);
      Alert.alert("Success", "Report uploaded successfully.");
    } catch (error: any) {
      Alert.alert("Upload failed!", error.message);
    }
  };

  const StepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[0, 1, 2, 3].map((step) => (
        <View
          key={step}
          style={[
            styles.stepCircle,
            currentStep === step && styles.stepCircleActive,
          ]}
        />
      ))}
    </View>
  );
  

  const renderStep = () => {
    return (
      <View>
        <StepIndicator />
        {currentStep === 0 && (
          <View style={styles.uploadSection}>
            {!image && (
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Text style={styles.buttonText}>Pick Image to Upload</Text>
              </TouchableOpacity>
            )}
            {image && (
              <>
                <Image source={{ uri: image }} style={styles.uploadPreview} />
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() => setCurrentStep(1)}
                >
                  <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
        {currentStep === 1 && (
          <View style={styles.formSection}>
            <Text style={styles.formHeader}>Describe the issue</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter a description..."
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
            />
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => setCurrentStep(2)}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}
        {currentStep === 2 && (
          <View style={styles.formSection}>
            <Text style={styles.formHeader}>Select a Category</Text>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={styles.categoryButton}
                onPress={() => setCategory(cat)}
              >
                <Text style={styles.categoryButtonText}>{cat}</Text>
              </TouchableOpacity>
            ))}
            {category && (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => setCurrentStep(3)}
              >
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        {currentStep === 3 && (
          <View style={styles.formSection}>
            <Text style={styles.formHeader}>Enter the Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Address Line 1"
              placeholderTextColor="#999"
              value={address.line1}
              onChangeText={(text) => setAddress({ ...address, line1: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Address Line 2 (Optional)"
              placeholderTextColor="#999"
              value={address.line2}
              onChangeText={(text) => setAddress({ ...address, line2: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="City"
              placeholderTextColor="#999"
              value={address.city}
              onChangeText={(text) => setAddress({ ...address, city: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Eircode"
              placeholderTextColor="#999"
              value={address.eircode}
              onChangeText={(text) => setAddress({ ...address, eircode: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Country"
              placeholderTextColor="#999"
              value={address.country}
              onChangeText={(text) => setAddress({ ...address, country: text })}
            />
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={uploadImage}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.header}>Your Reports</Text>
          <FlatList
            horizontal
            data={images}
            renderItem={({ item }) => (
              <View style={styles.reportThumbnail}>
                <Image source={{ uri: item }} style={styles.thumbnail} />
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteImage(item)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            style={styles.reportList}
          />
          {renderStep()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "black",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF", // White text
    marginBottom: 20,
    textAlign: "center",
  },
  reportList: {
    marginBottom: 20,
  },
  reportThumbnail: {
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    width: 100,
    height: 130,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnail: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginBottom: 5,
  },
  deleteButton: {
    backgroundColor: "#FF5252", // Red for delete
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  uploadSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  uploadPreview: {
    width: 250,
    height: 250,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#B7E561",
  },
  uploadButton: {
    backgroundColor: "#B7E561", // Green for button
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  buttonText: {
    color: "#000", // Black text for contrast
    fontWeight: "bold",
    fontSize: 16,
  },
  formSection: {
    marginVertical: 20,
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  formHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#2b2b2b",
    color: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
    width: "100%",
    borderWidth: 1,
    borderColor: "#555",
  },
  categoryButton: {
    backgroundColor: "#2b2b2b",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#555",
  },
  categoryButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  stepCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#555",
    marginHorizontal: 5,
  },
  stepCircleActive: {
    backgroundColor: "#B7E561",
  },
});
