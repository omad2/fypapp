import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { auth, storage } from "../../FirebaseConfig";
import { router } from "expo-router";
import { getAuth } from "firebase/auth";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [images, setImages] = useState<string[]>([]);

  // Ensure user is authenticated
  useEffect(() => {
    getAuth().onAuthStateChanged((user) => {
      if (!user) router.replace("/");
      else fetchImages(user.uid);
    });
  }, []);

  const fetchImages = async (userId: string) => {
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

  const leaderboardData = [
    { country: "Ireland", city: "Dublin", rank: "#1", reportsSolved: 43485 },
    { country: "Ireland", city: "Galway", rank: "#2", reportsSolved: 34222 },
    { country: "Ireland", city: "Cork", rank: "#3", reportsSolved: 30000 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={() => auth.signOut()}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Find It. Report It. Solve It.</Text>
          <Text style={styles.subHeader}>
            Welcome back, <Text style={styles.highlightText}>User</Text>! Let’s
            make your city safer and cleaner.
          </Text>
        </View>

        <View style={styles.latestReportsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>See Latest Reports</Text>
            <TouchableOpacity>
              <Text style={styles.viewMoreText}>View More</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={images}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.reportImage} />
            )}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View style={styles.leaderboardSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Leaderboard Rankings</Text>
          </View>
          <FlatList
            data={leaderboardData}
            renderItem={({ item }) => (
              <View style={styles.leaderboardItem}>
                <Text style={styles.leaderboardText}>
                  {item.country} - {item.city} - {item.rank}
                </Text>
                <Text style={styles.reportsSolvedText}>
                  Reports Solved: {item.reportsSolved}
                </Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>

        <TouchableOpacity style={styles.reportButton}>
          <Text style={styles.reportButtonText}>Report</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Black background
    padding: 20,
  },
  signOutButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#B7E561", // Green button color
    padding: 10,
    borderRadius: 10,
    zIndex: 1,
  },
  signOutText: {
    color: "#000", // Black text
    fontWeight: "600",
  },
  header: {
    marginTop: 80,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#B7E561", // Green color
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "400",
    color: "#FFF",
    marginTop: 10,
  },
  highlightText: {
    color: "#B7E561", // Green color
    fontWeight: "bold",
  },
  latestReportsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
  },
  viewMoreText: {
    fontSize: 14,
    color: "#B7E561", // Green color
  },
  reportImage: {
    width: 100,
    height: 100,
    backgroundColor: "#2b2b2b",
    marginRight: 10,
    borderRadius: 10,
  },
  leaderboardSection: {
    marginBottom: 20,
  },
  leaderboardItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#1a1a1a",
    marginBottom: 5,
    borderRadius: 10,
  },
  leaderboardText: {
    color: "#FFF",
    fontSize: 14,
  },
  reportsSolvedText: {
    color: "#B7E561", // Green highlight for numbers
    fontWeight: "600",
  },
  reportButton: {
    backgroundColor: "#B7E561", // Green button
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 10,
  },
  reportButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "700",
  },
});
