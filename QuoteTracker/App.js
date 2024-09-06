import React, { useState, useEffect } from "react";
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

export default function App() {
  const [quote, setQuote] = useState("");
  const [quotes, setQuotes] = useState([]);

  // Load quotes from the file when the app starts
  useEffect(() => {
    loadQuotesFromFile();
  }, []);

  // Function to add a new quote
  const addQuote = () => {
    if (quote.trim()) {
      const newQuotes = [...quotes, quote.trim()];
      setQuotes(newQuotes);
      setQuote(""); // Clear input field
      saveQuotesToFile(newQuotes); // Save quotes to local file
    } else {
      Alert.alert("Input Error", "Please enter a valid quote.");
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
