import React, { useState, useEffect } from "react";
import { database } from "./firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  FlatList,
  Alert,
} from "react-native";
import * as FileSystem from "expo-file-system";

const fileUri = FileSystem.documentDirectory + "quotes.txt";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const HomeScreen = ({ navigation }) => {
  const [quote, setQuote] = useState("");
  const [quotes, loading, error] = useCollection(
    collection(database, "quotes")
  );

  const data = quotes?.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  // Load quotes from the file when the app starts
  useEffect(() => {
    loadQuotesFromFile();
  }, []);

  // Function to add a new quote
  const addQuote = async () => {
    if (quote.trim()) {
      try {
        await addDoc(collection(database, "quotes"), {
          quote: quote, // Field should be 'quote' to match what you're using in Firestore
        });
        setQuote(""); // Clear input field
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    } else {
      Alert.alert("Error", "Please enter a quote.");
    }
  };

  const deleteQuote = async (id) => {
    try {
      await deleteDoc(doc(database, "quotes", id));
      Alert.alert("Success", "Quote deleted!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  // Function to save quotes to a file
  const saveQuotesToFile = async (quotesToSave) => {
    try {
      await FileSystem.writeAsStringAsync(
        fileUri,
        JSON.stringify(quotesToSave)
      );
      Alert.alert("Success", "Quote saved successfully!");
    } catch (error) {
      Alert.alert("Save Error", "Failed to save quotes.");
    }
  };

  // Function to load quotes from the file
  const loadQuotesFromFile = async () => {
    try {
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      const loadedQuotes = JSON.parse(fileContent) || [];
      setQuotes(loadedQuotes);
    } catch (error) {
      // If the file doesn't exist, ignore the error and initialize with an empty list
      console.log("No quotes file found, initializing empty list.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Quote App</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter a new quote"
        value={quote}
        onChangeText={(text) => setQuote(text)}
      />

      <Button title="Add Quote" onPress={addQuote} color="#1E90FF" />

      {loading ? (
        <Text>Loading quotes...</Text>
      ) : data?.length === 0 ? (
        <Text style={styles.noQuotesText}>No quotes yet, add one!</Text>
      ) : (
        <FlatList
          style={styles.list}
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.quoteContainer}>
              <Text style={styles.quoteText}>
                {item.quote.length > 25
                  ? item.quote.substring(0, 25) + "..."
                  : item.quote}
              </Text>
              <Button
                title="Update"
                onPress={() => navigation.navigate("Details", { quote: item })}
              />
              <Button
                title="Delete"
                color="red"
                onPress={() => deleteQuote(item.id)}
              />
            </View>
          )}
        />
      )}
    </View>
  );
};
const DetailsScreen = ({ route, navigation }) => {
  const [quote, setQuote] = useState(route.params?.quote.quote);
  const quoteId = route.params?.quote.id;

  const saveUpdate = async () => {
    try {
      await updateDoc(doc(database, "quotes", quoteId), { quote });
      Alert.alert("Quote saved!", "Your changes have been saved.");
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        multiline
        value={quote}
        onChangeText={(text) => setQuote(text)}
      />
      <Button title="Save" onPress={saveUpdate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  list: {
    marginTop: 20,
  },
  quoteContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 15,
    alignItems: "center",
  },
  quoteText: {
    fontSize: 18,
    fontStyle: "italic",
    textAlign: "center",
  },
  noQuotesText: {
    fontSize: 18,
    fontStyle: "italic",
    textAlign: "center",
    color: "#aaa",
    marginTop: 20,
  },
});
