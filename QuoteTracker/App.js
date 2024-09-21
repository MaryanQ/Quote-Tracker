import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  FlatList,
  Alert,
  Platform,
} from "react-native";
import * as FileSystem from "expo-file-system";

const fileUri = "quotes.txt"; // Dummy fileUri for native platforms

export default function App() {
  const [quote, setQuote] = useState("");
  const [quotes, setQuotes] = useState([]);

  // Load quotes from the file or localStorage when the app starts
  useEffect(() => {
    if (Platform.OS === "web") {
      loadQuotesFromLocalStorage();
    } else {
      loadQuotesFromFile();
    }
  }, []);

  // Function to add a new quote
  const addQuote = () => {
    if (quote.trim()) {
      const newQuotes = [...quotes, quote.trim()];
      setQuotes(newQuotes);
      setQuote(""); // Clear input field
      if (Platform.OS === "web") {
        saveQuotesToLocalStorage(newQuotes);
      } else {
        saveQuotesToFile(newQuotes);
      }
    } else {
      Alert.alert("Input Error", "Please enter a valid quote.");
    }
  };

  // Function to save quotes to localStorage (Web)
  const saveQuotesToLocalStorage = (quotesToSave) => {
    try {
      localStorage.setItem("quotes", JSON.stringify(quotesToSave));
      Alert.alert("Success", "Quote saved successfully!");
    } catch (error) {
      Alert.alert("Save Error", "Failed to save quotes.");
      console.log("Save error:", error);
    }
  };

  // Function to load quotes from localStorage (Web)
  const loadQuotesFromLocalStorage = () => {
    try {
      const savedQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
      setQuotes(savedQuotes);
      console.log("Quotes loaded from localStorage:", savedQuotes);
    } catch (error) {
      console.log("No quotes found in localStorage, initializing empty list.");
    }
  };

  // Function to save quotes to a file (Native platforms)
  const saveQuotesToFile = async (quotesToSave) => {
    try {
      await FileSystem.writeAsStringAsync(
        fileUri,
        JSON.stringify(quotesToSave)
      );
      Alert.alert("Success", "Quote saved successfully!");
      console.log("Quotes saved to file:", quotesToSave);
    } catch (error) {
      Alert.alert("Save Error", "Failed to save quotes.");
      console.log("Save error:", error);
    }
  };

  // Function to load quotes from the file (Native platforms)
  const loadQuotesFromFile = async () => {
    try {
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      const loadedQuotes = JSON.parse(fileContent) || [];
      setQuotes(loadedQuotes);
      console.log("Quotes loaded from file:", loadedQuotes);
    } catch (error) {
      console.log("No quotes file found, initializing empty list.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Quote App</Text>

      {/* Text input for entering a new quote */}
      <TextInput
        style={styles.input}
        placeholder="Enter a new quote"
        value={quote}
        onChangeText={(text) => setQuote(text)}
      />

      {/* Button to add the new quote */}
      <Button title="Add Quote" onPress={addQuote} color="#1E90FF" />

      {/* Show message if no quotes */}
      {quotes.length === 0 ? (
        <Text style={styles.noQuotesText}>No quotes yet, add one!</Text>
      ) : (
        <FlatList
          style={styles.list}
          data={quotes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.quoteContainer}>
              <Text style={styles.quoteText}>"{item}"</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

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
