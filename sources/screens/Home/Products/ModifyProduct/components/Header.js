import React from 'react'
import { StyleSheet, Dimensions } from 'react-native';
import { Container, Text, Button } from '../../../../../components';
import { colors } from '../../../../../themes/colors';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const Header = ({ label, }) => {
    const navigation = useNavigation();
    return (
        <Container
            row width={width} height={48} ph={16} aCenter between>
                <Text width={'80%'} body color={colors.BLACK} bold letterSpacing={0.5}>{label}</Text>
                <Button 
                    onPress={() => navigation.goBack()}
                    width={'20%'} jCenter aEnd bgColor={'transparent'}>
                    <Feather name='x' size={24} color={colors.BLACK} />
                </Button>
        </Container>
    )
}

export default Header

const styles = StyleSheet.create({})