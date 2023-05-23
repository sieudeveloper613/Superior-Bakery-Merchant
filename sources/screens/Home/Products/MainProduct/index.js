import React, { useEffect, useState, useCallback } from 'react'
import { StyleSheet, FlatList, RefreshControl, View } from 'react-native'
import { Container, Button, Text, Image } from '../../../../components'
import { colors } from '../../../../themes/colors'
import Feather from 'react-native-vector-icons/Feather'
import { Header, Notification } from '../../../../components/custom'
import SearchAndFilter from './components/SearchAndFilter'
import FilterModal from './components/FilterModal'
import { logDebug, logError } from '../../../../utils/console'
import { PRODUCT } from '../../../../routes/ScreenName'
import { productApi } from '../../../../api'
import formatMoney from '../../../../utils/formatMoney'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import AntIcon from 'react-native-vector-icons/AntDesign'
import { useIsFocused } from '@react-navigation/native'
import { BASE_URL } from '../../../../api/url'

const MainProduct = ({ navigation: { navigate } }) => {
  // check if screen is focused
  const isFocused = useIsFocused();
  const [filter, setFilter] = useState(null);
  const [open, setOpen] = useState(false);
  const [productList, setProductList] = useState([]);
  const [filteredList, setFilteredList] = useState([])
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [productId, setProductId] = useState(null);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    onCollectProduct();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    onCollectProduct();
  },[])

  useEffect(() => {
    isFocused && onCollectProduct();
  },[isFocused])

  const searchProductList = (text) => {
    const lowerCaseText = text.toLowerCase();
    setFilter(lowerCaseText);
    const newData = productList.filter(item => {
      const lowerCaseName = item.name.toLowerCase();
      return lowerCaseName.includes(lowerCaseText);
    });
    setFilteredList(newData);
  }

  const onRemoveProductById = async (id) => {
    try {
      const onRemove = await productApi.removeProductById(id);
      if (onRemove) {
        const { isSuccess, message } = onRemove;
        if( isSuccess === 1 ){
          logDebug('Message: ', message);
          Toast.show({
            type: 'success',
            props: { 
              icon: 'smile-circle',
              title: 'Thành công',
              message: 'Xóa sản phẩm thành công!', 
              backgroundColor: colors.GREEN },
            position: 'bottom'
          });
          setModalVisible(false);
          await onCollectProduct();
        } else {
          Toast.show({
            type: 'error',
            props: { 
              icon: 'frown',
              title: 'Thất bại',
              message: 'Xóa sản phẩm thất bại!', 
              backgroundColor: colors.TOMATO },
            position: 'bottom'
          });
          logDebug('Message: ', message);
        }
      } else {

      }
    } catch (error) {
      logError('remove-product-catch: ', error);
    }
    
  }

  const toastConfig = {
    success: ({ props }) => (
        <View style={{ 
            flexDirection: 'row',
            width: '90%', 
            backgroundColor: props.backgroundColor,
            padding: 10,
            borderRadius: 6,
            elevation: 2,
            alignItems: 'center'}}>
            <AntIcon name={props.icon} size={24} color={'white'} />
            <View style={{
              flexDirection: 'column',
              width: '85%',
              marginLeft: 12
            }}>
              <Text size={16} color={'white'} bold>{props.title}</Text>
              <Text size={12} color={'white'} >{props.message}</Text>
            </View>
        </View>
    ),
    error: ({ props }) => (
        <View style={{ 
            flexDirection: 'row',
            width: '90%', 
            backgroundColor: props.backgroundColor,
            padding: 10,
            borderRadius: 6,
            elevation: 2,
            alignItems: 'center'}}>
            <AntIcon name={props.icon} size={24} color={'white'} />
            <View style={{
              flexDirection: 'column',
              width: '85%',
              marginLeft: 12
            }}>
              <Text size={16} color={'white'} bold>{props.title}</Text>
              <Text size={12} color={'white'} >{props.message}</Text>
            </View>
        </View>
    ),
};

  const NotiModal = () => {
    return (
      <Notification visible={modalVisible}>
        <Container width={'90%'} height={'auto'} p={24} r={6} bgColor={colors.WHITE} shadow>
          <Text size={18} color={colors.TOMATO} bold uppercase mb={16}>Xóa sản phẩm</Text>
          <Text paragraph color={colors.DARK_GREY}>Bạn có chắc chắn muốn xóa sản phẩm này?</Text>
          <Container row width={'100%'} between mt={24}>
            <Button 
              onPress={() => setModalVisible(false)}
              width={'30%'} height={42} r={6}
              bgColor={colors.BLACK_OPACITY_20} jCenter aCenter>
              <Text body color={colors.DARK_GREY}>Trở lại</Text>
            </Button>
            <Button 
              onPress={() => onRemoveProductById(productId)}
              width={'50%'} height={42} r={6}
              bgColor={colors.TOMATO} jCenter aCenter>
              <Text body color={colors.WHITE} bold>Có, xóa</Text>
            </Button>
          </Container>
        </Container>
      </Notification>
    )
  }

  const onCollectProduct = async () => {
    try {
      const collect = await productApi.collectProducts();
      if (collect) {
        const { products } = collect;
        setProductList(products);
      } else {
        setProductList([])
      }
    } catch (error) {
      logError('product-catch: ', error);
    }
  }


  const renderItem = ({ item, index }) => {
    return (
      <Button
        onLongPress={() => {
          setProductId(item._id);
          setModalVisible(true);
        }}
        onPress={() => navigate(PRODUCT.PRODUCT_DETAIL_SCREEN, { item }) }
        key={item._id} 
        row width={'100%'} height={92} pr={16} shadow mv={8}
        bgColor={colors.WHITE} rTopEnd={16} rBottomEnd={16} rBottomStart={60} rTopStart={60}>
          {
            item?.image?.includes(':3000/') ?
              <Image imageUri={BASE_URL + item.image.split('3000')[1]} round={92} />
            :
              <Image imageUri={item.image} round={92} />
          }

          <Container 
            width={'72%'} height={'auto'} pv={12} pl={8}
            >
              <Text
                body color={colors.BLACK} bold
                numberOfLines={1} ellipsizeMode={'tail'}
              >{item.name}</Text>

              <Container 
                width={'100%'} mt={4}
                row between aCenter>
                <Container width={'50%'}>
                  <Text mb={4}>{item.meal}</Text>
                  <Container row aCenter>
                    <Feather style={{ transform: [{ scaleX: -1 }], marginRight: 8 }} name='coffee' size={24} color={colors.ORNAGE}/>
                    <Text paragraph color={colors.ORNAGE}>{item.power} calo</Text>
                  </Container>
                </Container>
                <Text body color={colors.TOMATO} bold>{formatMoney(item.price, 1)}</Text>
              </Container>
          </Container>
      </Button>
    )
  }

  return (
      <Container safe flex={1} bgColor={colors.LIGHT_GREY}>
          <Header label={'Sản phẩm'}/>
          <Container flex={1} p={16}>
              <SearchAndFilter 
                  placeholder={'Nhập tên sản phẩm'}
                  value={filter}
                  onChangeText={(text) => searchProductList(text)}
                  onPress={() => onCollectProduct()}
                  // onPress={() => setOpen(prevOpen => !prevOpen)}
              />
              {
                  open && <FilterModal 
                              onChoose={() => {}}
                              onClose={() => setOpen(false)}
                              onPress={() => {}}
                          />
              }
              {productList.length > 0 || filteredList.length > 0 ? (
                <FlatList
                  contentContainerStyle={{ marginVertical: 16, paddingBottom: 42 }}
                  data={filteredList && filteredList.length > 0 ? filteredList : productList.reverse()}
                  keyExtractor={item => item._id}
                  renderItem={renderItem}
                  refreshing={refreshing}
                  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                />
              ) : (
                <Container width={'100%'} height={48} r={6} mv={16} jCenter aCenter bgColor={colors.GREY}>
                  <Text paragraph color={colors.DARK_GREY}>Hiện tại không có sản phẩm nào</Text>
                </Container>
              )}
          </Container>
          <Button 
            onPress={() => navigate(PRODUCT.MODIFY_PRODUCT_SCREEN)}
            width={'100%'} height={56} mt={16}
            bgColor={colors.PRIMARY} jCenter aCenter>
            <Text body color={colors.WHITE} bold uppercase>Thêm sản phẩm</Text>
          </Button>
          <NotiModal />
          <Toast config={toastConfig} />
      </Container>
  )
}

export default MainProduct

const styles = StyleSheet.create({})