export const scenes = {
  hotelScene: {
    sceneId: "hotelScene",
    type: "equirectangular",
    preview: "https://jhouxu.github.io/test/images/panorama_preview.jpg",
    panorama: "https://img.alicdn.com/imgextra/i2/6000000004217/O1CN01djW9bE1h1QprTMP5d_!!6000000004217-0-hotel.jpg",
    hotSpots: [
      {
        pitch: -1,
        yaw: 76,
        type: "info",
        text: "休闲吧台",
      },
      {
        pitch: -7,
        yaw: 195,
        type: "scene",
        text: "前往客厅",
        sceneId: "living",
      },
      {
        pitch: -9.99366514624976,
        yaw: 109.02809340651967,
        type: "scene",
        text: "前往客厅",
        sceneId: "living",
      },
    ],
    // yaw: 109,
  },

  living: {
    sceneId: "living",
    type: "cubemap",
    preview: "https://img.alicdn.com/imgextra/i1/O1CN01dVOIEe1IhEcaIPw2z_!!6000000000924-0-tps-100-100.jpg",
    cubeMap: [
      "https://gw.alicdn.com/imgextra/i3/O1CN01550SRA1JcwWgs0sIj_!!6000000001050-0-tps-1500-1500.jpg",
      "https://img.alicdn.com/imgextra/i4/O1CN01e796bV1P2CRfCQkrA_!!6000000001782-0-tps-1500-1500.jpg",
      "https://img.alicdn.com/imgextra/i4/O1CN01GcW84X29SHK4oJlWc_!!6000000008066-0-tps-1500-1500.jpg",
      "https://img.alicdn.com/imgextra/i2/O1CN01ZHLck11GX2ZgBHA4o_!!6000000000631-0-tps-1500-1500.jpg",
      "https://img.alicdn.com/imgextra/i2/O1CN019c9xKu1ig1aC7pWPk_!!6000000004441-0-tps-1500-1500.jpg",
      "https://img.alicdn.com/imgextra/i4/O1CN01XfaKOu1kzNYODz7HD_!!6000000004754-0-tps-1500-1500.jpg",
    ],
    hotSpots: [
      {
        pitch: -5.984732127927283,
        yaw: 159.5438702588048,
        type: "scene",
        text: "前往房间",
        sceneId: "room",
      },

      {
        pitch: -15.88047137599221,
        yaw: -124.78952823291061,
        type: "scene",
        text: "前往大堂",
        sceneId: "hotelScene",
      },
    ],
    // yaw: -124, // 设置全景图的起始偏航位置
  },
  room: {
    sceneId: "room",
    type: "cubemap",
    preview: "https://img.alicdn.com/imgextra/i1/O1CN01KU3hrj1uJNO2OdyaC_!!6000000006016-0-tps-100-100.jpg",
    cubeMap: [
      "https://img.alicdn.com/imgextra/i1/O1CN01fWDIfB1bWgC3NnVVa_!!6000000003473-0-tps-1500-1500.jpg",
      "https://img.alicdn.com/imgextra/i2/O1CN01xt97cb1YMeg4BOCbI_!!6000000003045-0-tps-1500-1500.jpg",
      "https://img.alicdn.com/imgextra/i1/O1CN01xKTq1u1DR8cdeMeYt_!!6000000000212-0-tps-1500-1500.jpg",
      "https://img.alicdn.com/imgextra/i3/O1CN01Zko8Qy1p1uCLUYBji_!!6000000005301-0-tps-1500-1500.jpg",
      "https://img.alicdn.com/imgextra/i3/O1CN01k3AVvK28W71UNWXW7_!!6000000007939-0-tps-1500-1500.jpg",
      "https://img.alicdn.com/imgextra/i1/O1CN015MBT6P1N8x3J83Fqo_!!6000000001526-0-tps-1500-1500.jpg",
    ],
    hotSpots: [
      {
        pitch: -14.205156853981782,
        yaw: -80.6414865633464,
        type: "scene",
        text: "前往客厅",
        sceneId: "living",
      },
    ],
    yaw: 0,
  },
};
