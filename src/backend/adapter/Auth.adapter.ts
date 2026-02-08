import AuthController from '../controller/Auth.controller'
import CreateAdapter from '../utils/helper/CreateAdapter.helper'

const AuthAdapter = {
	RequestCode: CreateAdapter({
		controller: AuthController.Request.Code,
		SuccessLink: [
			{ rel: 'self', href: '/auth/v1/request/code/' },
			{ rel: 'verify', href: '/auth/v1/verify/code/' },
		],
		ErrorLink: [{ rel: 'self', href: '/auth/v1/request/code/' }],
	}),
	VerifyCode: CreateAdapter({
		controller: AuthController.VerifyCode,
		SuccessLink: [
			{ rel: 'self', href: '/auth/v1/verify/code/' },
			{ rel: 'create', href: '/user/v1/create/' },
			{ rel: 'update', href: '/user/v1/update/' },
			{ rel: 'delete', href: '/user/v1/delete/' },
		],
		ErrorLink: [
			{ rel: 'self', href: '/auth/v1/verify/code/' },
			{ rel: 'requestCode', href: '/auth/v1/request/code/' },
		],
	}),
	RequestAccessToken: CreateAdapter({
		controller: AuthController.Request.AccessToken,
		SuccessLink: [
			{ rel: 'self', href: '/auth/v1/request/accessToken/' },
			{ rel: 'user', href: '/user/v1/get/' },
		],
		ErrorLink: [
			{ rel: 'self', href: '/auth/v1/request/accessToken/' },
			{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
		],
	}),
	RequestRefreshTokenCode: CreateAdapter({
		controller: AuthController.RefreshToken.Code,
		SuccessLink: [
			{ rel: 'self', href: '/auth/v1/request/refreshToken/code/' },
			{ rel: 'token', href: '/auth/v1/request/refreshToken/' },
		],
		ErrorLink: [{ rel: 'self', href: '/auth/v1/request/refreshToken/code/' }],
	}),
	RequestRefreshToken: CreateAdapter({
		controller: AuthController.RefreshToken.Confirm,
		SuccessLink: [
			{ rel: 'self', href: '/auth/v1/request/refreshToken/' },
			{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
		],
		ErrorLink: [{ rel: 'self', href: '/auth/v1/request/refreshToken/' }],
	}),
	AccountRequestCode: CreateAdapter({
		controller: AuthController.Account.RequestCode,
		SuccessLink: [
			{ rel: 'self', href: '/auth/v1/account/request/code/' },
			{ rel: 'change', href: '/auth/v1/change/account/' },
		],
		ErrorLink: [{ rel: 'self', href: '/auth/v1/account/request/code/' }],
	}),
	ChangeAccount: CreateAdapter({
		controller: AuthController.Account.Change,
		options: { transaction: true },
		SuccessLink: [
			{ rel: 'self', href: '/auth/v1/change/account/' },
			{ rel: 'user', href: '/user/v1/get/' },
		],
		ErrorLink: [
			{ rel: 'self', href: '/auth/v1/change/account/' },
			{ rel: 'requestCode', href: '/auth/v1/account/request/code/' },
		],
	}),
	PasswordRequestCode: CreateAdapter({
		controller: AuthController.Pwd.RequestCode,
		SuccessLink: [
			{ rel: 'self', href: '/auth/v1/password/request/code/' },
			{ rel: 'change', href: '/auth/v1/change/password/' },
		],
		ErrorLink: [{ rel: 'self', href: '/auth/v1/password/request/code/' }],
	}),
	ChangePassword: CreateAdapter({
		controller: AuthController.Pwd.Change,
		options: { transaction: true },
		SuccessLink: [
			{ rel: 'self', href: '/auth/v1/change/password/' },
			{ rel: 'logout', href: '/auth/v1/request/logout/' },
		],
		ErrorLink: [
			{ rel: 'self', href: '/auth/v1/change/password/' },
			{ rel: 'requestCode', href: '/auth/v1/password/request/code/' },
		],
	}),
	Logout: CreateAdapter({
		controller: AuthController.Request.Logout,
		SuccessLink: [
			{ rel: 'self', href: '/auth/v1/request/logout/' },
			{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
		],
		ErrorLink: [
			{ rel: 'self', href: '/auth/v1/request/logout/' },
			{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
		],
	}),
}

export default AuthAdapter
