const getPosition = () => {
  return new Promise((resolve, reject) => {
    if (!window.navigator.geolocation) {
      reject({ status: false, message: "您当前访问浏览器不支持获取地理位置信息，请更换浏览器重试" });
    } else {
      let options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };

      window.navigator.geolocation.getCurrentPosition(
        (position) => {
          let { latitude, longitude } = position.coords;
          resolve({
            status: true,
            data: {
              latitude,
              longitude,
            },
          });
        },
        () => {
          reject({ status: false, message: "网络超时，请重试" });
        },
        options
      );
    }
  });
};
