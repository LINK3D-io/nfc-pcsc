import request from './request';

export const login = (
	username,
	password,
  ) => {
	// user can login with either username/email. The backend will handle it.
	return request.post('/auth/login', {
	  username,
	  password,
	  code: undefined,
	});
  };
