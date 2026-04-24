import request from '@/utils/requestUtil'

export function fetchContent() {
	return request({
		method: 'GET',
		url: '/sso/info'
	})
}

export function register(data) {
	return request({
		method: 'POST',
		url: '/sso/register',
		params: data
	})
}

export function login(data) {
	return request({
		method: 'POST',
		url: '/sso/login',
		params: data
	})
}

export function getAuthCode(telephone) {
	return request({
		method: 'GET',
		url: '/sso/getAuthCode',
		params: { telephone }
	})
}

export function updatePassword(data) {
	return request({
		method: 'POST',
		url: '/sso/updatePassword',
		params: data
	})
}

export function refreshToken() {
	return request({
		method: 'GET',
		url: '/sso/refreshToken'
	})
}
