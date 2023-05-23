import { BASE_URL } from './url'
import axios from 'axios';
import { logDebug, logError } from '../utils/console'

const collectCategory = async () => {
    try {
        const onCollect = await axios.get(`${BASE_URL}/api/category`);
        logDebug('category-data: ', onCollect.data);
        return onCollect.data;
    } catch (error) {
        logError('collect-category-error: ', error);
    }
}

export default {
    collectCategory,
}