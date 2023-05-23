import { StyleSheet, Text, View } from 'react-native'
import {SafeAreaProvider} from 'react-native-safe-area-context';
import React from 'react'
import AppNavigation from './routes'
const App = () => {
  return (
    <SafeAreaProvider>
      <AppNavigation />
    </SafeAreaProvider>
  )
}

export default App

const styles = StyleSheet.create({})