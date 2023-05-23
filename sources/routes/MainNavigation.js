import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { PRODUCT } from './ScreenName';
import { MainProduct, ModifyProduct, ProductDetail } from '../screens/Home/Products'
const Stack = createNativeStackNavigator();

function MainNavigation () {
  return (
    <Stack.Navigator 
      initialRouteName={PRODUCT.MAIN_PRODUCT_SCREEN}
      screenOptions={{headerShown: false}}>
        <Stack.Screen name={PRODUCT.MAIN_PRODUCT_SCREEN} component={MainProduct}/>
        <Stack.Screen name={PRODUCT.MODIFY_PRODUCT_SCREEN} component={ModifyProduct}/>
        <Stack.Screen name={PRODUCT.PRODUCT_DETAIL_SCREEN} component={ProductDetail}/>
    </Stack.Navigator>
  )
}

export default MainNavigation
