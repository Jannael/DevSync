import AuthController from '../controller/Auth.controller'
import CreateAdapter from '../utils/helper/CreateAdapter.helper'

const AuthAdapter = {
	RequestCode: CreateAdapter({ controller: AuthController.Request.Code }),
	VerifyCode: CreateAdapter({ controller: AuthController.VerifyCode }),
	RequestAccessToken: CreateAdapter({
		controller: AuthController.Request.AccessToken,
	}),
	RequestRefreshTokenCode: CreateAdapter({
		controller: AuthController.RefreshToken.Code,
	}),
	RequestRefreshToken: CreateAdapter({
		controller: AuthController.RefreshToken.Confirm,
	}),
	AccountRequestCode: CreateAdapter({
		controller: AuthController.Account.RequestCode,
	}),
	ChangeAccount: CreateAdapter({
		controller: AuthController.Account.Change,
		options: { transaction: true },
	}),
	PasswordRequestCode: CreateAdapter({
		controller: AuthController.Pwd.RequestCode,
	}),
	ChangePassword: CreateAdapter({
		controller: AuthController.Pwd.Change,
	}),
	Logout: CreateAdapter({ controller: AuthController.Request.Logout }),
}

export default AuthAdapter
