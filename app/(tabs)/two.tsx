import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Text,
  SafeAreaView,
  View,
  RefreshControl,
  ScrollView,
} from "react-native";
import { storage, auth } from "../../FirebaseConfig";
import { getDownloadURL, ref, listAll, deleteObject } from "firebase/storage";
import { User } from "firebase/auth";

export default function TabTwoScreen() {
  const [images, setImages] = useState<any[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchImages = async (userId: any) => {
    try {
      const storageRef = ref(storage, `images/${userId}`);
      const result = await listAll(storageRef);
      const urls = await Promise.all(result.items.map((itemRef) => getDownloadURL(itemRef)));
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

  const onRefresh = async () => {
    if (user) {
      setRefreshing(true);
      await fetchImages(user.uid);
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
          <Text style={[styles.filterText, styles.filterActive]}>TRENDING</Text>
          <Text style={styles.filterText}>NEW</Text>
          <Text style={styles.filterText}>DANGEROUS</Text>
          <Text style={styles.filterText}>SOLVED</Text>
          <Text style={styles.filterText}>PENDING</Text>
        </ScrollView>

        {/* All Reports Section */}
        <Text style={styles.title}>ALL REPORTS</Text>

        <FlatList
          data={images}
          renderItem={({ item }) => (
            <View style={styles.reportCard}>
              {/* Display image */}
              <Image source={{ uri: item }} style={styles.reportImage} />
              <View style={styles.reportDetails}>
                <Text style={styles.reportText}>REPORTED BY: <Text style={styles.reportHighlight}>User</Text></Text>
                <Text style={styles.reportText}>STATUS: <Text style={styles.reportHighlight}>SOLVED</Text></Text>
                <Text style={styles.reportText}>
                  DESCRIPTION: Broken streetlights near downtown area.
                </Text>
                <Text style={styles.reportVotes}>200 USERS UPVOTED THIS</Text>
                {/* Delete Button */}
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteImage(item)}>
                  <Text style={styles.deleteButtonText}>DELETE</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000", // Black background
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  filterBar: {
    marginBottom: 10,
    flexDirection: "row",
  },
  filterText: {
    color: "#FFF",
    fontSize: 14,
    marginRight: 20,
  },
  filterActive: {
    color: "#B7E561", // Green color for active filter
    fontWeight: "bold",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 10,
  },
  reportCard: {
    backgroundColor: "#1A1A1A", // Dark card background
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
  },
  reportImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  reportDetails: {
    marginBottom: 10,
  },
  reportText: {
    color: "#FFF",
    fontSize: 14,
    marginBottom: 5,
  },
  reportHighlight: {
    color: "#B7E561", // Highlighted green
    fontWeight: "bold",
  },
  reportVotes: {
    color: "#FFF",
    fontSize: 12,
    marginVertical: 5,
  },
  deleteButton: {
    backgroundColor: "#FF5252", // Red button
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 12,
  },
});
