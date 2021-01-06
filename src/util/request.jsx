import axios from 'axios';
import axiosInstance from './axiosInterceptors';
import { setValue, getValue, clearValue } from './storage';

// GET、DELETE请求
export function httpRequest(method, url, data, config = {}) {
    let reqObj = {
        url: url,
        method: method
    };
    if ([('put', 'post')].includes(method.toLowerCase())) {
        reqObj.data = data;
    }
    if ([('get', 'delete')].includes(method.toLowerCase())) {
        reqObj.params = data;
    }
    return axiosInstance(reqObj);
}

// 获取token
export const login = async data => {
    const res = await httpRequest('post', '/token/', data);
    setValue('access', res.data.access);
    setValue('refresh', res.data.refresh);
};

export function logout() {
    setTimeout(() => {
        clearValue('access');
        clearValue('refresh');
        window.location.reload();
    }, 1500);
}

/**
 * @description 封装刷新token的方法
 * @param {*} callback 回调函数，刷新token以后，继续完成之前的请求
 * @returns 数据请求的promise对象
 */
export const refreshToken = async callback => {
    try {
        const res = await axios.post('/token/refresh/', {
            refresh: getValue('refresh')
        });
        setValue('access', res.data.access);

        // 更新token以后，继续执行接口请求
        const result = await callback();
        return result;
    } catch (err) {
        if (err.response.status === 401) {
            // 跳转至登录页，提醒用户重新登录
            console.log('当前身份已过期，请重新登录');
            login({ username: 'juqipeng', password: 'peng123150' });
        } else {
            console.log(err.response);
        }
    }
};
