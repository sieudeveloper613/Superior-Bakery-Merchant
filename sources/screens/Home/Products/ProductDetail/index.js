import React, { useState } from 'react'
import { StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Container, Button, Input, Text, Image } from '../../../../components';
import { colors } from '../../../../themes/colors';
import Feather from 'react-native-vector-icons/Feather';
import HeaderName from './components/HeaderName';
import FoodInfo from './components/FoodInfo';
import FoodNote from './components/FoodNote';
import formatMoney from '../../../../utils/formatMoney';
import { PRODUCT } from '../../../../routes/ScreenName';
import { BASE_URL } from '../../../../api/url';

const Detail = ({ navigation: { navigate }, route }) => {
  const { item } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [count, setCount] = useState(0);
  const { sidedishs, sizes } = item;
  console.log('selected-items: ', selectedItems)
  console.log('get-item-from-home: ', item)
  console.log('is-favorite: ', isFavorite)

  const toggleFavorite = () => {
    setIsFavorite(prevState => !prevState)
  }
  return (
    <Container safe flex={1} bgColor={colors.LIGHT_GREY}>
      <Container flex={1} p={16}>
        <Container flex={0.1}>
          <HeaderName
            label={item.name}
            onPress={() => toggleFavorite()}
            color={isFavorite ? colors.TOMATO : colors.DARK_GREY} 
          />
        </Container>
        <ScrollView 
          style={{ flex: 0.8, marginVertical: 16}}
          contentContainerStyle={{ paddingBottom: 8 }}
          showsVerticalScrollIndicator={false}>
            {
              item?.image?.includes(':3000/') ?
                <Image imageUri={BASE_URL + item.image.split('3000')[1]} width={'100%'} height={300} radius={16} />
              :
                <Image imageUri={item.image} width={'100%'} height={300} radius={16} />
            }
            {/* <Image imageUri={item.image} width={'100%'} height={300} radius={16}/> */}
            <FoodInfo
              meal={item.meal}
              power={item.power}
              price={item.price}
              onMinus={() => {
                if(count == 0) {
                  setCount(0);
                } else {
                  setCount(count - 1)
                }
              }}
              count={count}
              onPlus={() => {
                if(count == 49) {
                  setCount(49);
                } else {
                  setCount(count + 1)
                }
              }} 
            />

            {/* --- DISTRIBUTE AND ELEMENTS --- */}
            <Container
              row width={'100%'} height={'auto'} between mb={8}>
                <Container 
                  width={'48%'} height={200} p={12} r={16}
                  bgColor={colors.WHITE} shadow>
                    <Text body color={colors.PRIMARY} bold>Mô tả</Text>
                    <Text paragraph color={colors.DARK_GREY} justify>{item.distribute}</Text>
                  </Container>
                  <Container 
                  width={'48%'} height={200} p={12} r={16}
                  bgColor={colors.WHITE} shadow>
                    <Text body color={colors.PRIMARY} bold>Thành phần</Text>
                    {
                      item?.elements?.map((item, index) => {
                        return (
                          <Text key={index} paragraph color={colors.DARK_GREY} mv={2}>{item}</Text>
                        )
                      })
                    }
                  </Container>
            </Container>

            {/* --- SIDE ORDER LIST --- */}
            {sizes.length > 0 &&
              <Container
                width={'100%'} height={'auto'} p={12} r={16} mv={8}
                bgColor={colors.WHITE} shadow>
                <Text body color={colors.PRIMARY} bold mb={16}>Chọn kích cỡ</Text>
                {/* --- ADD SIDE ORDER HERE WITH MAP --- */}
                {
                  item.sizes.map((item, index) => {
                    const isSelected = selectedItems.includes(item._id);
                    return (
                      <Button
                        onPress={() => {
                          if (isSelected) {
                            setSelectedItems(selectedItems.filter((id) => id !== item._id));
                          } else {
                            setSelectedItems([...selectedItems, item._id]);
                          }
                        }}
                        key={item._id}
                        row width={'100%'} height={42} aCenter>
                          <Container 
                            width={24} height={24} r={24/2} 
                            bgColor={isSelected ? colors.PRIMARY : colors.GREY} aCenter jCenter>
                            {
                              isSelected && <Feather name='check' size={20} color={colors.WHITE}/>
                            }
                          </Container>
                          <Container row width={'88%'} ml={8}>
                            <Text width={'50%'} body color={colors.BLACK}>{item.size}</Text>
                            <Text width={'50%'} body color={colors.TOMATO} right bold>{formatMoney(item.cost, 1)}</Text>
                          </Container>
                      </Button>
                    )
                  })
                }
              </Container>
            }
            
            {/* --- SIDE ORDER LIST --- */}
            {
              sidedishs.length > 0 &&
              <Container
                width={'100%'} height={'auto'} p={12} r={16} mv={8}
                bgColor={colors.WHITE} shadow>
                <Text body color={colors.PRIMARY} bold mb={16}>Chọn món thêm</Text>
                {/* --- ADD SIDE ORDER HERE WITH MAP --- */}
                {
                  item.sidedishs.map((item, index) => {
                    const isSelected = selectedItems.includes(item._id);
                    return (
                      <Button
                        onPress={() => {
                          if (isSelected) {
                            setSelectedItems(selectedItems.filter((id) => id !== item._id));
                          } else {
                            setSelectedItems([...selectedItems, item._id]);
                          }
                        }}
                        key={item._id}
                        row width={'100%'} height={42} aCenter>
                          <Container 
                            width={24} height={24} r={24/2} 
                            bgColor={isSelected ? colors.PRIMARY : colors.GREY} aCenter jCenter>
                            {
                              isSelected && <Feather name='check' size={20} color={colors.WHITE}/>
                            }
                          </Container>
                          <Container row width={'88%'} ml={8}>
                            <Text width={'50%'} body color={colors.BLACK}>{item.dish}</Text>
                            <Text width={'50%'} body color={colors.TOMATO} right bold>{formatMoney(item.cost, 1)}</Text>
                          </Container>
                      </Button>
                    )
                  })
                }
              </Container>
            }

            {/* --- ADD FOOD NOTE HERE --- */}
            <FoodNote
              label={'Ghi chú (nếu có)'}
              placeholder={'Nhập ghi chú ở đây...'}
              value={null}
              onChangeText={() => {}}
            />
        </ScrollView>
        <Container flex={0.1}>
          <Button 
            onPress={() => navigate(PRODUCT.MODIFY_PRODUCT_SCREEN, {item})}
            width={'100%'} height={48} r={12}
            bgColor={colors.PRIMARY} jCenter aCenter>
            <Text body color={colors.WHITE} bold>chỉnh sửa sản phẩm</Text>
          </Button>
        </Container>
      </Container>
    </Container>
  )
}

export default Detail

const styles = StyleSheet.create({})