import React from 'react'
import { StyleSheet } from 'react-native';
import { Container, Text } from '../../../../../components';
import { Dropdown } from 'react-native-element-dropdown';
import { colors } from '../../../../../themes/colors';

const CategorySelect = ({ title, labelField, valueField, value, onChange, data, error, placeholder }) => {
  return (
    <Container 
        width={'100%'} height={'auto'} p={12} r={6} mb={8}
        bgColor={colors.WHITE} shadow jCenter>
        <Text paragraph left color={colors.BLACK} mb={8}>{title}<Text body color={colors.TOMATO}>*</Text></Text>
        <Dropdown
          data={data}
          placeholder={placeholder}
          labelField={labelField}
          valueField={valueField}
          value={value}
          onChange={onChange}
          style={{
          shadowOffset: { width: 0, height: 1 },
          shadowColor: colors.SHADOW,
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 2,
          width: '100%',
          height: 48,
          paddingHorizontal: 8,
          backgroundColor: colors.LIGHT_GREY,
          borderRadius: 6
          }}
          placeholderStyle={{
          color: colors.BLACK,
          fontSize: 16,
          fontWeight: 'bold'
          }}
          itemTextStyle={{
          color: colors.BLACK,
          fontSize: 14
          }}
        />
        {
          error && <Text width={'100%'} color={colors.TOMATO} caption right mt={2}>{error}</Text>
        }
    </Container>
  )
}

export default CategorySelect

const styles = StyleSheet.create({})