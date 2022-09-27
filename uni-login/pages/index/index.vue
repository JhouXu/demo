<template>
  <view class="content"><button open-type="getUserInfo" @getuserinfo="getuserinfo">微信用户一键注册/快捷登录</button></view>
</template>

<script>
import RdWXBizDataCrypt from '@/utils/RdWXBizDataCrypt.js';

export default {
  data() {
    return {};
  },
  onLoad() {
    uni.getProvider({
      service: 'oauth',
      success: function(res) {
        console.log(res);
      },
      fail: function(err) {
        console.log(err);
      }
    });

    uni.getSystemInfo({
      success: function(res) {
        console.log(res);
      },
      fail(err) {
        console.log(err);
      }
    });
  },

  methods: {
    getuserinfo() {
      let appid = '1112238794';
      let secret = 'B4sF9xfRjcv8v88T';
      let code = '';
      let openid = '';
      let session_key = '';

      // 获取 code
      uni.login({
        provider: 'qq',
        success: function(res) {
          code = res.code;

          // 获取openid 和 session_key
          qq.request({
            url: `https://api.q.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`,
            success(res) {
              let { data } = res;
              openid = data.openid;
              session_key = data.session_key;

              // 获取用户信息
              uni.getUserInfo({
                provider: 'qq',
                success: function(infoRes) {
                  let { encryptedData, iv } = infoRes;

                  // 对encryptedData 数据进行解密
                  let rd = new RdWXBizDataCrypt(appid, session_key);
                  let data = rd.decryptData(encryptedData, iv);
                  console.log(data);
                }
              });
            }
          });
        }
      });
    }
  }
};
</script>

<style></style>
