<template>
  <div class="exhibition-view">
    ExhibitionView

    <swiper class="swiper" ref="mySwiper" :options="swiperOptions">
      <swiper-slide>
        <img src="@/assets/images/test/1.jpg" />
      </swiper-slide>
      <swiper-slide>
        <img src="@/assets/images/test/2.jpg" />
      </swiper-slide>
      <swiper-slide>
        <img src="@/assets/images/test/3.jpg" />
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
</template>

<script>
export default {
  name: 'ExhibitionView',
  components: {},

  data() {
    return {
      swiperOptions: {
        loop: true,
        pagination: {
          el: '.swiper-pagination',
        },
      },
    }
  },

  created() {},

  mounted() {},

  methods: {},
}
</script>

<style lang="scss" scoped>
.exhibition-view {
  .swiper {
    .swiper-slide {
      font-size: 0;

      img {
        width: 100% !important;
        object-fit: cover;
      }
    }
  }
}
</style>
