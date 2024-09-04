import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  FlatList,
} from "react-native";
import { useState } from "react";
import { tailwind } from "tailwindcss-react-native";
import * as FileSystem from "expo-file-system";

const fileUri = FileSystem.documentDirectory + "quotes.txt";

export default function App() {
  //state variabler til at holde data
  const [Quote, setQuote] = useState("");
  const [SavedQuotes, setSavedQuotes] = useState([]);

  function buttonHandler() {
    alert("Button Pressed");
  }

  const AddNewQuote = () => {
    if (Quote.trim()) {
      setSavedQuotes([...SavedQuotes, Quote.trim()]); //tilføj ny quote til array
      setQuote(""); //nulstil
    }
  };

  return (
    <View style={styles.container}>
      <Text>Quote Tracker</Text>

      {/* Inputfelt til at indtaste et nyt citat */}
      <TextInput
        placeholder="Enter Quote"
        value={Quote} // Binder inputfeltet til state
        onChangeText={(text) => setQuote(text)} //opdater state ved ændring
      />

      {/* Knappen der tilføjer et nyt citat til listen */}
      <Button title="Add Quote" onPress={AddNewQuote} />

      {/* Liste over gemte citater */}
      <FlatList
        data={SavedQuotes}
        keyExtractor={(item, index) => index.toString()} //unik key til hver item
        renderItem={({ item }) => <Text style={styles.quoteItem}>{item}</Text>}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 200,
  },
});
