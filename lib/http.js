// lib/http.js

// 通过 axios 处理请求
const axios = require('axios')

axios.interceptors.response.use(res => {
  return res.data;
})


/**
 * 获取模板列表
 * @returns Promise
 */
async function getRepoList() {
  return axios.get('https://my-json-server.typicode.com/zhangxilong-43/Fake-API/repoList')
}

module.exports = {
  getRepoList,
}
