import React, { useState } from 'react'
import { StyleSheet } from 'react-native';
import { Container, Input, Text } from '../../../../../components'
import { colors } from '../../../../../themes/colors';

const InputField = ({ label, width, height, value, onChangeText, placeholder, error, onFocus = () => {}, ...props}) => {
    const [isFocused, setIsFocused] = useState(false);
    return (
        <Container width={width} mv={6}>
            <Container width={'100%'} height={height} p={8} r={6}
                b={1} bColor={isFocused ? colors.GREEN : colors.GREY}>
                <Text caption color={isFocused ? colors.GREEN : colors.DARK_GREY} mb={0}>{label}</Text>
                <Input
                    width={'100%'} body color={colors.BLACK}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={() => {
                        onFocus();
                        setIsFocused(true);
                    }}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />
            </Container>
            {
                error && <Text width={'100%'} color={colors.TOMATO} caption right mt={2}>{error}</Text>
            }
        </Container>   
    )
}

export default InputField

const styles = StyleSheet.create({})