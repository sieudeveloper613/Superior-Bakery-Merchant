import React, { useState, useEffect } from 'react'
import { StyleSheet, Keyboard, View } from 'react-native'
import { Container, Text, Input, Image, Button } from '../../../../components'
import { colors } from '../../../../themes/colors'
import Header from './components/Header';
import CategorySelect from './components/CategorySelect';
import InputField from './components/InputField';
import { categoryApi, productApi } from '../../../../api'
import Feather from 'react-native-vector-icons/Feather'
import { logDebug, logError, logInfo } from '../../../../utils/console';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { BASE_URL } from '../../../../api/url';
import {
  launchCamera,
  launchImageLibrary
} from 'react-native-image-picker';
import { Loading } from '../../../../components/custom';
import AntIcon from 'react-native-vector-icons/AntDesign'

const ModifyProduct = ({ navigation: { goBack },route }) => {
    const item = route?.params?.item;
    logDebug('item-from-id: ', item == undefined ? null : BASE_URL + item.image.split('3000')[1] )
    const [selectedCategory, setSelectedCategory] = useState(item?.category ? item?.category : null);
    const [errorCategory, setErrorCategory] = useState(null);
    const [categoryList, setCategoryList] = useState([]);
    const [buttonLabel, setButtonLabel] = useState(null);
    const [sidedishs, setSidedishs] = useState(item?.sidedishs ? item?.sidedishs : []);
    const [elements, setElements] = useState(item?.elements ? item?.elements : []);
    const [sizes, setSizes] = useState(item?.sizes ? item?.sizes : []);
    const [error, setError] = useState({});
    const [isUrl, setIsUrl] = useState(false);
    const [inputs, setInputs] = useState({
      foodName: item?.name ? item?.name : '',
      meal: item?.meal ? item?.meal : '',
      power: item?.power ? item?.power : '',
      price: item?.price.toString() ? item?.price.toString() : '',
      distribute: item?.distribute ? item?.distribute : '',
      image: item?.image ? item?.image : '',
    })
    const [filePath, setFilePath] = useState({});
    const [loading, setLoading] = useState(false);
    console.log('filePath: ', filePath)
    console.log('filePath-uri: ', filePath?.uri)
    useEffect(() => {
      if (item) {
        setButtonLabel('Cật nhập sản phẩm')
      } else {
        setButtonLabel('Thêm sản phẩm mới')
      }
      onCollectCategory();
    }, []);

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

    const chooseFile = (type) => {
      let options = {
        mediaType: type,
        maxWidth: 300,
        maxHeight: 300,
        selectionLimit: 1,
        mediaType: 'photo',
        quality: 1,
      };
      launchImageLibrary(options, (response) => {
        console.log('Response = ', response);
        const { assets } = response;
        if (response.didCancel) {
          alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }

        console.log('uri -> ', assets[0].uri);
        console.log('width -> ', assets[0].width);
        console.log('height -> ', assets[0].height);
        console.log('fileSize -> ', assets[0].fileSize);
        console.log('type -> ', assets[0].type);
        console.log('fileName -> ', assets[0].fileName);
        
        setFilePath(assets[0]);
      });
    };

    const handleOnChange = (text, input) => {
      setInputs(prevState => ({...prevState, [input]: text}))
    }

    const handleError = (ErrorMessage, input) => {
      setError(prevState => ({...prevState, [input]: ErrorMessage}))
    }

    const handleSubmit = () => {
      Keyboard.dismiss();
      let valid = true;

      if (!selectedCategory){
        setErrorCategory('Vui lòng chọn loại sản phẩm!')
        valid = false;
      } else {
        setErrorCategory(null)
      }

      // validate phone number
      if(!inputs.foodName) {
          handleError('Vui lòng nhập tên sản phẩm!', 'foodName');
          valid = false;
      }

      // validate email and email format
      if(!inputs.meal) {
          handleError('Vui lòng nhập bữa ăn!', 'meal');
          valid = false;
      }

      // validate name of unit of person
      if(!inputs.power) {
          handleError('Vui lòng nhập năng lượng!', 'power');
          valid = false;
      }
      
      // validate account
      if(!inputs.distribute) {
          handleError('Miêu tả món ăn không được để trống!', 'distribute');
          valid = false;
      }

      if (!inputs.price) {
        handleError('Giá sản phẩm không được trống!', 'price');
        valid = false;
      }

      if(valid) {
        onModifyProduct();
      }
  };

  const onModifyProduct = async () => {
    setLoading(true);
    try {
      if( item ) {
        console.log('get-file-update: ', filePath?.uri)
        const onUpdate = await productApi.updateProduct(
          item._id,
          inputs.foodName,
          inputs.price,
          inputs.meal,
          inputs.power,
          filePath?.uri ? filePath?.uri : inputs.image,
          // inputs.image ? inputs.image : item?.image ? item?.image : filePath?.uri,
          inputs.distribute,
          elements ? elements : [],
          sidedishs ? sidedishs : [],
          sizes ? sizes : [],
          selectedCategory._id ? selectedCategory._id : item?.category
        );
        if (onUpdate) {
          const { isSuccess, message, product } = onUpdate;
          if (isSuccess === 1) {
            logInfo(message, product);
            Toast.show({
              type: 'success',
              props: { 
                icon: 'smile-circle',
                title: 'Thành công',
                message: 'Cật nhập sản phẩm thành công!', 
                backgroundColor: colors.GREEN },
              position: 'bottom'
            });
          } else {
            logInfo(message);
            Toast.show({
              type: 'error',
              props: { 
                icon: 'frown',
                title: 'Thất bại',
                message: 'Cật nhập sản phẩm thất bại, vui lòng liên hệ cho chồng!', 
                backgroundColor: colors.TOMATO },
              position: 'bottom'
            });
          }
        } else {
          return new Error('update product failed!')
        }
      } else {
        const onInsert = await productApi.insertProduct(
          inputs.foodName,
          inputs.price,
          inputs.meal,
          inputs.power,
          inputs.image ? inputs.image : filePath?.uri,
          // filePath?.uri,
          inputs.distribute,
          elements,
          sidedishs,
          sizes,
          selectedCategory._id
        )
        if (onInsert) {
          const { isSuccess, message, product } = onInsert;
          if (isSuccess === 1) {
            logInfo(message, product);
            Toast.show({
              type: 'success',
              props: { 
                icon: 'smile-circle',
                title: 'Thành công',
                message: 'Thêm sản phẩm mới thành công!', 
                backgroundColor: colors.GREEN },
              position: 'bottom'
            });
            setInputs({
              foodName: '',
              meal: '',
              power: '',
              price: '',
              distribute: '',
              image: '',
            })
            setSelectedCategory(null);
            setSidedishs([]);
            setElements([]);
            setSizes([]);
            // setTimeout(() => {
            //   goBack();
            // }, 1200);
          } else {
            logInfo(message);
            Toast.show({
              type: 'error',
              props: { 
                icon: 'frown',
                title: 'Thất bại',
                message: 'Thêm sản phẩm thất bại, vui lòng liên hệ cho chồng!', 
                backgroundColor: colors.TOMATO },
              position: 'bottom'
            });
          }
        } else {
          return new Error('insert product failed!')
        }
      }
    } catch (error) {
      logError('modify-product-error: ', error);
      setLoading(false);
    }
    setLoading(false);
  }

    const onCollectCategory = async () => {
      try {
        const onCollect = await categoryApi.collectCategory();
        if (onCollect) {
          const { categories } = onCollect;
          setCategoryList(categories);
        } else {
          setCategoryList([]);
          return new Error('cannot collect category!')
        }
      } catch (error) {
        console.log('collect-category-catch: ', error);
      }
    }

    const addElement = () => {
      setElements([...elements, '']);
    };
  
    const removeElement = (index) => {
      const newElements = [...elements];
      newElements.splice(index, 1);
      setElements(newElements);
    };
  
    const updateElement = (text, index) => {
      const newElements = [...elements];
      newElements[index] = text;
      setElements(newElements);
    };

    const addSidedish = () => {
      setSidedishs([...sidedishs, { dish: '', cost: '' }]);
    };
  
    const removeSidedish = (index) => {
      const newSidedishs = [...sidedishs];
      newSidedishs.splice(index, 1);
      setSidedishs(newSidedishs);
    };
  
    const updateSideDishName = (text, index) => {
      const newSidedishs = [...sidedishs];
      newSidedishs[index].dish = text;
      setSidedishs(newSidedishs);
    };
  
    const updateSideDishCost = (text, index) => {
      const newSidedishs = [...sidedishs];
      newSidedishs[index].cost = text;
      setSidedishs(newSidedishs);
    };

    const addSize = () => {
      setSizes([...sizes, { size: '', cost: '' }]);
    };
  
    const removeSize = (index) => {
      const newSizes = [...sizes];
      newSizes.splice(index, 1);
      setSizes(newSizes);
    };
  
    const updateSizeName = (text, index) => {
      const newSizes = [...sizes];
      newSizes[index].size = text;
      setSizes(newSizes);
    };
  
    const updateSizeCost = (text, index) => {
      const newSizes = [...sizes];
      newSizes[index].cost = text;
      setSizes(newSizes);
    };

    const renderSidedishs = () => {
      return sidedishs.map((item, index) => {
        return (
          <Container row width={'100%'} key={index} mv={4} between>
            <Container width={'50%'} height={42} b={1} r={6} ph={8} bColor={colors.DARK_GREY}>
              <Input
                placeholder={`Nhập món thêm ${index + 1}`}
                width={'100%'} height={42} color={colors.BLACK} body
                value={item?.dish}
                onChangeText={(text) => updateSideDishName(text, index)}
              />
            </Container>

            <Container width={'35%'} height={42} b={1} r={6} ph={8} bColor={colors.DARK_GREY}>
              <Input
                placeholder={`Nhập giá ${index + 1}`}
                width={'100%'} height={42} color={colors.BLACK} body
                value={item?.cost.toString()}
                onChangeText={(text) => updateSideDishCost(text, index)}
                keyboardType={'numeric'}
              />
            </Container>
            <Button 
              onPress={() => removeSidedish(index)}
              width={'12%'} jCenter aEnd>
              <Feather name='x-square' size={32} color={colors.TOMATO} />
            </Button>
          </Container>
        );
      });
    };

    const renderSizes = () => {
      return sizes.map((item, index) => {
        logDebug('item-cost: ', item.cost)
        return (
          <Container row width={'100%'} key={index} mv={4} between>
            <Container width={'50%'} height={42} b={1} r={6} ph={8} bColor={colors.DARK_GREY}>
              <Input
                placeholder={`Nhập kích thước ${index + 1}`}
                width={'100%'} height={42} color={colors.BLACK} body
                value={item?.size}
                onChangeText={(text) => updateSizeName(text, index)}
              />
            </Container>

            <Container width={'35%'} height={42} b={1} r={6} ph={8} bColor={colors.DARK_GREY}>
              <Input
                placeholder={`Nhập giá ${index + 1}`}
                width={'100%'} height={42} color={colors.BLACK} body
                value={item?.cost.toString()}
                onChangeText={(text) => updateSizeCost(text, index)}
                keyboardType={'numeric'}
              />
            </Container>
            <Button 
              onPress={() => removeSize(index)}
              width={'12%'} jCenter aEnd>
              <Feather name='x-square' size={32} color={colors.TOMATO} />
            </Button>
          </Container>
        );
      });
    };
    
    const renderElements = () => {
      return elements.map((item, index) => {
        logDebug('item-element: ', item)
        return (
          <Container row width={'100%'} key={index} mv={4}>
            <Container width={'85%'} height={42} b={1} r={6} ph={8} bColor={colors.DARK_GREY}>
              <Input
                placeholder={`Nhập thành phần ${index + 1}`}
                width={'100%'} height={42} color={colors.BLACK} body
                value={item}
                onChangeText={(text) => updateElement(text, index)}
              />
            </Container>
            <Button 
              onPress={() => removeElement(index)}
              width={'15%'} jCenter aEnd>
              <Feather name='x-square' size={32} color={colors.TOMATO} />
            </Button>
          </Container>
        );
      });
    };

    return (
      <Container flex={1} bgColor={colors.LIGHT_GREY}>
        <Loading visible={loading} text={item ? 'Đang cật nhập...' : 'Đang thêm sản phẩm...'}/>
        <Header label={'Thêm món mới'}/>
        <Container scrollView flex={1} p={16}>
          <CategorySelect 
            title={'Chọn loại món ăn'}
            placeholder={'Chọn loại món'}
            data={categoryList}
            labelField={'name'}
            valueField={'_id'} 
            value={selectedCategory}
            error={errorCategory}
            onChange={item => {
              console.log('item-category: ', item)
              setSelectedCategory(item)
            }}
          />
          <Container 
            width={'100%'} height={'auto'} r={6} p={12} mv={8}
            bgColor={colors.WHITE} shadow
          >
            <InputField
              width={'100%'} height={62}
              label={'Tên món ăn'}
              placeholder={'Nhập tên món ăn'}
              value={inputs.foodName}
              error={error.foodName}
              onFocus={() => handleError(null, 'foodName')}
              onChangeText={(text) => handleOnChange(text, 'foodName')}
            />
            <Container row width={'100%'} between>
              <InputField
                width={'49%'} height={62}
                label={'Bữa ăn'}
                placeholder={'Nhập kiểu bữa ăn'}
                value={inputs.meal}
                error={error.meal}
                onFocus={() => handleError(null, 'meal')}
                onChangeText={(text) => handleOnChange(text, 'meal')}
              />
              <InputField
                width={'49%'} height={62}
                label={'Năng lượng dự tính'}
                placeholder={'Nhập năng lượng'}
                value={inputs.power.toString()}
                error={error.power}
                onFocus={() => handleError(null, 'power')}
                onChangeText={(text) => handleOnChange(text, 'power')}
                keyboardType={'numeric'}
              />
            </Container>
            <InputField
              style={{ textAlignVertical: 'top' }}
              width={'100%'} height={'auto'}
              multiline
              numberOfLines={5}
              maxLength={160}
              label={'Miêu tả món ăn'}
              placeholder={'Nhập miêu tả'}
              value={inputs.distribute}
              error={error.distribute}
              onFocus={() => handleError(null, 'distribute')}
              onChangeText={(text) => handleOnChange(text, 'distribute')}
              keyboardType={'default'}
            />
            <InputField
              style={{ letterSpacing: 1 }}
              width={'100%'} height={62}
              label={'Giá sản phẩm'}
              placeholder={'Nhập giá sản phẩm'}
              value={inputs.price}
              error={error.price}
              onFocus={() => handleError(null, 'price')}
              onChangeText={(text) => handleOnChange(text, 'price')}
              keyboardType={'numeric'}
            />
          </Container>

          {/* --- ADDING ELEMENTS --- */}
          <Container 
            width={'100%'} height={'auto'} r={6} p={12} mv={8}
            bgColor={colors.WHITE} shadow>
              <Text paragraph color={colors.BLACK} bold mb={8}>Thành phần</Text>
              {renderElements()}
              <Button 
                onPress={addElement}
                width={'100%'} height={42} aCenter jCenter r={6} mt={8}
                bgColor={colors.GREEN}>
                <Text body color={colors.WHITE} bold>Thêm thành phần</Text>
              </Button>
          </Container>

          {/* --- ADDING SIDE-DISHS --- */}
          <Container 
            width={'100%'} height={'auto'} r={6} p={12} mv={8}
            bgColor={colors.WHITE} shadow>
              <Text paragraph color={colors.BLACK} bold mb={8}>Món thêm</Text>
              {renderSidedishs()}
              <Button 
                onPress={addSidedish}
                width={'100%'} height={42} aCenter jCenter r={6} mt={8}
                bgColor={colors.GREEN}>
                <Text body color={colors.WHITE} bold>Thêm món phụ</Text>
              </Button>
          </Container>

          {/* --- ADDING SIZES ---  */}
          <Container 
            width={'100%'} height={'auto'} r={6} p={12} mv={8}
            bgColor={colors.WHITE} shadow>
              <Text paragraph color={colors.BLACK} bold mb={8}>Kích cỡ</Text>
              {renderSizes()}
              <Button 
                onPress={addSize}
                width={'100%'} height={42} aCenter jCenter r={6} mt={8}
                bgColor={colors.GREEN}>
                <Text body color={colors.WHITE} bold>Thêm kích cỡ</Text>
              </Button>
          </Container>

          <Container
            width={'100%'} height={'auto'} mv={8} r={6} p={12}
            bgColor={colors.WHITE} shadow>
              <Text paragraph color={colors.BLACK} bold mb={8}>Thêm ảnh</Text>
              <Container row width={'100%'}>
                <Container width={'50%'}>
                  {
                    isUrl ? 
                      <InputField
                        style={{ textAlignVertical: 'top' }}
                        width={'100%'} height={128}
                        multiline
                        numberOfLines={5}
                        maxLength={100}
                        label={'Thêm ảnh từ URL'}
                        placeholder={'Nhập url'}
                        value={inputs.image}
                        onFocus={() => handleError(null, 'image')}
                        onChangeText={(text) => handleOnChange(text, 'image')}
                        keyboardType={'default'}
                      />
                    :
                      <Image style={{ backgroundColor: colors.GREY }} 
                              imageUri={
                                filePath?.uri ? 
                                  filePath?.uri : 
                                    item?.image ? 
                                      BASE_URL + item.image.split('3000')[1] : 
                                        inputs.image} square={128} radius={12}/>
                  }
                 
                </Container>
                <Container width={'50%'} ph={12}>
                  <Button 
                    onPress={() => setIsUrl(true)}
                    width={'100%'} height={42} r={6} mb={8}
                    shadow bgColor={colors.BLUE} aCenter jCenter>
                      <Text body color={colors.WHITE} bold>Nhập URL</Text>
                  </Button>
                  <Button
                    onPress={() => {
                      setIsUrl(false);
                      setTimeout(() => {
                        chooseFile('photo');
                      }, 500);
                    }}
                    width={'100%'} height={42} r={6}
                    shadow bgColor={colors.GREEN} aCenter jCenter>
                      <Text body color={colors.WHITE} bold>Từ thư viện</Text>
                  </Button>
                </Container>
              </Container>
          </Container>
        </Container>
        <Button
          onPress={() => handleSubmit()}
          width={'100%'} height={56} r={6} mt={16} center
          bgColor={colors.PRIMARY} shadow jCenter aCenter>
          <Text body color={colors.WHITE} bold uppercase>{buttonLabel}</Text>
        </Button>
        <Toast config={toastConfig} />
      </Container>
    )
}

export default ModifyProduct

const styles = StyleSheet.create({})