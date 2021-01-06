import axios from 'axios';
import { refreshToken, login } from './request';
import { getValue } from './storage';

// 创建实例
const axiosInstance = axios.create({});

// 请求拦截器
axiosInstance.interceptors.request.use(
    config => {
        // 接口使用JWT认证, 装载token值
        config.headers['Authorization'] = `Bearer ${getValue('access')}`;
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        // 响应异常处理
        if (error.response.status) {
            switch (error.response.status) {
                case 401:
                    const refresh = getValue('refresh');
                    if (!refresh) {
                        // 跳转至登录逻辑
                    } else {
                        const { config } = error;

                        // 刷新token完成以后，继续执行上一个请求
                        refreshToken(async () => {
                            const res = await axiosInstance(config);
                            return res;
                        });
                    }
                    break;
                case 404:
                    console.log('请求资源不存在');
                    break;
                case 504:
                    console.log('网络请求超时');
                    break;
                case 500:
                    console.log('请求服务异常');
                    break;
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
