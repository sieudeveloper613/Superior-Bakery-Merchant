import axios from "axios";
import { logDebug, logError, logInfo } from "../utils/console";
import { BASE_URL } from "./url";
import mime from "mime";

const collectProducts = async () => {
    try {
        const onCollect = await axios.get(`${BASE_URL}/api/collect-product`);
        logDebug('collect-products-data: ', onCollect.data);
        return onCollect.data;
    } catch (error) {
        logError('collect-products-error: ', error);
    }
}

// const insertProduct = async (name, price, meal, power, image, distribute, elements, sidedishs, sizes, category) => {
//     try {
//         logInfo('insert-product-params: ', name, price, meal, power, image, distribute, elements, sidedishs, sizes, category)
//         const onInsert = await axios.post(`${BASE_URL}/api/insert-product`, {
//             name, price, meal, power, image, distribute, elements, sidedishs, sizes, category
//         },{
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             }
//         })
//         logDebug('insert-product-data: ', onInsert.data);
//         return onInsert.data;
//     } catch (error) {
//         logError('insert-product-error: ', error);
//     }
// }

const insertProduct = async (name, price, meal, power, imageUri, distribute, elements, sidedishs, sizes, category) => {
    try {
        logInfo('insert-product-params: ', name, price, meal, power, imageUri, distribute, elements, sidedishs, sizes, category)
        // Tạo đối tượng FormData và đính kèm ảnh
        const formData = new FormData();
        formData.append('image', {
            uri: imageUri,
            type: 'image/jpeg',
            name: 'product.jpg',
        });
        // Đính kèm các trường dữ liệu khác
        formData.append('name', name);
        formData.append('price', price);
        formData.append('meal', meal);
        formData.append('power', power);
        formData.append('distribute', distribute);
        formData.append('elements', elements);
        formData.append('sidedishs', sidedishs);
        formData.append('sizes', sizes);
        formData.append('category', category);
        // Gửi yêu cầu đến API của bạn
        const onInsert = await axios.post(`${BASE_URL}/api/insert-product`, formData, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        });
        logDebug('insert-product-data: ', onInsert.data);
        return onInsert.data;
    } catch (error) {
        logError('insert-product-error: ', error);
    }
}

const updateProduct = async (id, name, price, meal, power, imageUri, distribute, elements, sidedishs, sizes, category) => {
    try {
        logInfo('update-product-params: ', id, name, price, meal, power, imageUri, distribute, elements, sidedishs, sizes, category)
        const formData = new FormData();
        formData.append('image', {
            uri: 'file://' + imageUri,
            type: 'image/jpeg'||'image/png',
            name: 'product.jpg',
        });
        // Đính kèm các trường dữ liệu khác
        formData.append('id', id);
        formData.append('name', name);
        formData.append('price', price);
        formData.append('meal', meal);
        formData.append('power', power);
        formData.append('distribute', distribute);
        formData.append('elements', elements);
        formData.append('sidedishs', sidedishs);
        formData.append('sizes', sizes);
        formData.append('category', category);
        const onUpdate = await axios.post(`${BASE_URL}/api/update-product`, formData, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            // transformRequest: (data, headers) => {
            //     return formData; // this is doing the trick
            //   },
        })
        logDebug('update-product-data: ', onUpdate.data);
        return onUpdate.data;
    } catch (error) {
        logError('update-product-error: ', error);
        if (error.response) {
            console.log('Server responded with:', error.response.data);
            console.log('Status code:', error.response.status);
            console.log('Headers:', error.response.headers);
          } else if (error.request) {
            console.log('No response received:', error.request);
          } else {
            console.log('Error during request:', error.message);
          }
    }
}

const removeProductById = async (id) => {
    try {
        logInfo('remove-product-params: ', id);
        const onRemove = await axios.get(`${BASE_URL}/api/remove-product?id=${id}`)
        logDebug('remove-product-data: ', onRemove.data);
        return onRemove.data;
    } catch (error) {
        logError('remove-product-error: ', error);
    }
}

export default {
    collectProducts,
    insertProduct,
    updateProduct,
    removeProductById
}