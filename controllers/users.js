const handleSuccess = require("../service/handleSuccess");
const appError = require("../service/appError");
const User = require("../models/users");
const { generateSendJWT } = require("../service/auth");
const validator = require("validator");
const bcrypt = require("bcrypt");
const passwordRule = /^([a-zA-Z]+\d+|\d+[a-zA-Z]+)[a-zA-Z0-9]*$/;

const user = {
  //註冊
  async sign_up(req, res, next) {
    const { name, email, photo, sex, password } = req.body;
    const errMsg = [];
    if (!name || !email || !password) {
      return appError(400, "欄位錯誤，請重新輸入", next);
    }

    const findUser = await User.findOne({ email });
    if (findUser) {
      return appError(400, "此E-mail已經註冊，請登入系統", next);
    }

    if (!validator.isLength(name, { min: 2 })) {
      errMsg.push("暱稱至少8個字元以上");
    }
    if (!validator.isLength(password, { min: 8 })) {
      errMsg.push("密碼需至少8碼以上");
    }
    if (!passwordRule.test(password)) {
      errMsg.push("密碼需英數混合的驗證");
    }
    if (!validator.isEmail(email)) {
      errMsg.push("Email 格式不正確");
    }

    if (errMsg.length > 0) {
      return appError(400, errMsg, next);
    }
    //console.log("test 會來這嗎?");

    const newPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      name,
      email,
      password: newPassword,
      photo,
    });

    generateSendJWT(newUser, 201, res);
  },
  //登入
  async sign_in(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
      return appError(400, "帳號密碼不可為空", next);
    }
    const user = await User.findOne({ email }).select("+password");
    console.log("user", user);

    const auth = await bcrypt.compare(password, user.password);
    if (!auth || !user) {
      return appError(400, "帳號或密碼錯誤，請重新輸入！", next);
    }
    generateSendJWT(user, 200, res);
  },

  //重設密碼
  async updatePassword(req, res, next) {
    const { password, confirmPassword } = req.body;
    const errMsg = [];
    if (!password || !confirmPassword) {
      return appError(400, "欄位輸入錯誤", next);
    }
    if (!validator.isLength(password, { min: 8 })) {
      errMsg.push("密碼需至少8碼以上");
    }
    if (password !== confirmPassword) {
      errMsg.push("密碼不一致！");
    }

    if (!passwordRule.test(password)) {
      errMsg.push("密碼需英數混合的驗證");
    }
    if (errMsg.length > 0) {
      return appError(400, errMsg, next);
    }
    newPassword = await bcrypt.hash(password, 12);
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        password: newPassword,
      },
      { new: true }
    );
    handleSuccess(res, "密碼更新成功", user);
  },

  //取得個人資料，需設計 isAuth middleware。
  async getProfile(req, res, next) {
    handleSuccess(res, req.user, user);
  },

  //更新個人資料，需設計 isAuth middleware
  async updateProfile(req, res, next) {
    const { name, gender, photo } = req.body;
    if (!name) {
      return appError(400, "欄位錯誤", next);
    } else {
      const editUser = await User.findByIdAndUpdate(
        req.user.id,
        {
          name,
          gender,
          photo,
        },
        { new: true }
      );
      if (!editUser) {
        return appError(400, "更新個人資料失敗", next);
      } else {
        const user = await User.findById(req.user.id);
        handleSuccess(res, "更新個人資料成功", user);
      }
    }
  },
};

module.exports = user;
