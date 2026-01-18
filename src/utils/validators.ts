export const validateUsername = (username: string): string | null => {
  const reg = /^[a-zA-Z0-9-_]{6,10}$/;
  if (!reg.test(username)) {
    return '账号只能由6-10位字母、数字或下划线构成';
  }
  return null;
};

export const validatePhone = (phone: string): string | null => {
  const reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
  if (!reg.test(phone)) {
    return '请输入正确的手机号';
  }
  return null;
};

export const validateCode = (code: string): string | null => {
  const reg = /^\d{6}$/;
  if (!reg.test(code)) {
    return '请输入正确的6位验证码';
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  const reg = /^[a-zA-Z0-9-_]{6,20}$/;
  if (!reg.test(password)) {
    return '密码只能由6-20位字母、数字或下划线组成';
  }
  return null;
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): string | null => {
  if (password !== confirmPassword) {
    return '两次输入的密码不一致';
  }
  return null;
};
