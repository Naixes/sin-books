import axios from 'axios'

import config from '../config'

class SafeRequest {
	// 返回重新封装的一个Promise，对请求过程中的错误进行拦截，避免后台接口错误影响前端
	static fetch(url, options) {
		let sfetch = axios(url)
		// 如果有参数
		if(options) {
			console.log(options.params)
			sfetch = axios(config.baseUrl + url, {
				methods: options.methods,
				body: options.params
			})
		}
		return new Promise((resolve, reject) => {
			let result = {
				code: 0,
				message: '',
				data: null
			}
			sfetch.then(res => {
				// 一些沟通好的交互形式
				// ...
				result.data = res.data
				resolve(result)
			}).catch((err) => {
				result.code = -1
				result.message = err.message
				// 发邮件，记日志等
				// ...
				reject(result)
			})
		})
	}
}

export default SafeRequest
