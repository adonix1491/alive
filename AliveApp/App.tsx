import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const App = () => {
  useEffect(() => {
    // Signal that JS is running
    const loadingText = document.getElementById('loading-text');
    if (loadingText) loadingText.innerText = 'App組件已掛載';
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello World from minimal App!</Text>
      <Text style={styles.text}>Web Build is Working.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 24,
    marginBottom: 20,
  }
});

export default App;
