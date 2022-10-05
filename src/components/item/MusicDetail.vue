<template>
  <img :src="musicList.al.picUrl" alt="" class="bgimg" />
  <div class="detailTop">
    <div class="detailTopLeft">
      <svg class="icon liebiao" aria-hidden="true" @click="backHome">
        <use xlink:href="#icon-zuojiantou"></use>
      </svg>
      <div class="leftMarquee">
        <p>{{ musicList.al.name }}</p>
        <!-- <Vue3Marquee style="color: #fff">{{ musicList.al.name }}</Vue3Marquee> -->
        <span v-for="item in musicList.ar" :key="item">
          {{ item.name }}
        </span>
        <svg class="icon liebiao" aria-hidden="true">
          <use xlink:href="#icon-youjiantou"></use>
        </svg>
      </div>
    </div>
    <div class="detailTopRight">
      <svg class="icon liebiao" aria-hidden="true">
        <use xlink:href="#icon-fenxiang"></use>
      </svg>
    </div>
  </div>
  <div class="detailContent" v-show="!isLyricShow">
    <img
      src="@/assets/needle-ab.png"
      alt=""
      class="img_needle"
      :class="{ img_needle_active: !isbtnShow }"
    />
    <img src="@/assets/cd.png" alt="" class="img_cd" />
    <img
      :src="musicList.al.picUrl"
      alt=""
      class="img_ar"
      @click="isLyricShow = true"
      :class="{ img_ar_active: !isbtnShow, img_ar_pauesd: isbtnShow }"
    />
  </div>
  <div class="musicLyric" ref="musicLyric" v-show="isLyricShow">
    <p
      v-for="item in lyric"
      :key="item"
      :class="{
        active:
          currentTime * 1000 >= item.time && currentTime * 1000 < item.pre,
      }"
    >
      {{ item.lrc }}
    </p>
  </div>
  <div class="detailFooter">
    <div class="footerTop">
      <svg class="icon liebiao" aria-hidden="true">
        <use xlink:href="#icon-aixin"></use>
      </svg>
      <svg class="icon liebiao" aria-hidden="true">
        <use xlink:href="#icon-wenhao"></use>
      </svg>
      <svg class="icon liebiao" aria-hidden="true">
        <use xlink:href="#icon-yinlechangpian"></use>
      </svg>
      <svg class="icon liebiao" aria-hidden="true">
        <use xlink:href="#icon-xiaoxi"></use>
      </svg>
      <svg class="icon liebiao" aria-hidden="true">
        <use xlink:href="#icon-shipin"></use>
      </svg>
    </div>
    <div class="footerContent">
      <input
        type="range"
        class="range"
        min="0"
        :max="duration"
        v-model="currentTime"
        step="0.05"
      />
    </div>
    <div class="footer">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-paihangbang"></use>
      </svg>
      <svg class="icon" aria-hidden="true" @click="goPlay(-1)">
        <use xlink:href="#icon-shangyishoushangyige"></use>
      </svg>
      <svg
        class="icon bofang"
        aria-hidden="true"
        v-if="isbtnShow"
        @click="play"
      >
        <use xlink:href="#icon-bofang"></use>
      </svg>
      <svg class="icon bofang" aria-hidden="true" v-else @click="play">
        <use xlink:href="#icon-zanting"></use>
      </svg>
      <svg class="icon" aria-hidden="true" @click="goPlay(1)">
        <use xlink:href="#icon-xiayigexiayishou"></use>
      </svg>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-zu"></use>
      </svg>
    </div>
  </div>
</template> 
 
<script>
// import { Vue3Marquee } from "vue3-marquee";
// import "vue3-marquee/dist/style.css";
import { mapMutations, mapState } from "vuex";

export default {
  data() {
    return {
      isLyricShow: false,
    };
  },
  computed: {
    //解构
    ...mapState([
      "lyricList",
      "currentTime",
      "playListIndex",
      "playList",
      "duration",
    ]),
    lyric: function () {
      let arr; //数组接收歌词
      //判断得到歌词值后开始操作
      if (this.lyricList.lyric) {
        //切割
        arr = this.lyricList.lyric.split(/[(\r\n)\r\n]+/).map((item, i) => {
          let min = item.slice(1, 3); //分钟
          let sec = item.slice(4, 6); //秒数
          let mill = item.slice(7, 10); //毫秒
          let lrc = item.slice(11, item.length); //歌词部分
          let time =
            parseInt(min) * 60 * 1000 + parseInt(sec) * 1000 + parseInt(mill); //总时间
          //判断毫秒两位/三位 重新切割
          if (isNaN(Number(mill))) {
            mill = item.slice(7, 9);
            lrc = item.slice(10, item.length);
            time =
              parseInt(min) * 60 * 1000 + parseInt(sec) * 1000 + parseInt(mill);
          }
          // console.log(min,sec,Number(mill),lrc);
          return { min, sec, mill, lrc, time };
        });
        arr.forEach((item, i) => {
          //判断是否到最后一行歌词
          if (i === arr.length - 1 || isNaN(arr[i + 1].time)) {
            item.pre = 100000;
          } else {
            item.pre = arr[i + 1].time;
          }
        });
      }
      console.log(arr);
      return arr;
    },
  },
  mounted() {
    // console.log(this.musicList);
    // console.log(this.musicList.lyric);
    this.addDuration();
  },
  props: ["musicList", "isbtnShow", "play", "addDuration"],

  methods: {
    backHome: function () {
      this.isLyricShow = false;
      this.updateDetailShow();
    },
    goPlay: function (num) {
      let index = this.playListIndex + num;
      if (index < 0) {
        index = this.playList.length - 1;
      } else if (index == this.playList.length) {
        index = 0;
      }
      this.updatePlayListIndex(index);
    },
    ...mapMutations(["updateDetailShow", "updatePlayListIndex"]),
  },
  watch: {
    currentTime: function (newValue) {
      let p = document.querySelector("p.active");
      // console.log([p]);
      if (p) {
        if (p.offsetTop > 300) {
          this.$refs.musicLyric.scrollTop = p.offsetTop - 300;
        }
      }
      //播放进度条到结束
      if (newValue === this.duration) {
        //如果为播放列表最后一首歌-回到第一首
        if (this.playListIndex === this.playList.length - 1) {
          this.updatePlayListIndex(0);
          this.play();
        } else {
          this.updatePlayListIndex(this.playListIndex + 1);
        }
      }
      // console.log([this.$refs.musicLyric])
    },
  },
  components: {
    // Vue3Marquee,
  },
};
</script>
<style lang="less" scoped>
.bgimg {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -1;
  filter: blur(70px);
}
.detailTop {
  width: 100%;
  height: 1rem;
  display: flex;
  padding: 0.2rem;
  justify-content: space-between;
  align-items: center;
  fill: #fff;
  .detailTopLeft {
    display: flex;
    align-items: center;
    .leftMarquee {
      width: 3rem;
      height: 100%;
      margin-left: 0.4rem;
      span {
        color: #999;
      }
      .icon {
        width: 0.3rem;
        height: 0.3rem;
        fill: #999;
      }
    }
  }
}
.detailContent {
  width: 100%;
  height: 9rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  .img_needle {
    width: 2rem;
    height: 3rem;
    position: absolute;
    left: 46%;
    transform-origin: 0 0;
    transform: rotate(-13deg);
    transition: all 2s;
  }
  .img_needle_active {
    width: 2rem;
    height: 3rem;
    position: absolute;
    left: 46%;
    transform-origin: 0 0;
    transform: rotate(0deg);
    transition: all 2s;
  }
  //cd背景
  .img_cd {
    width: 5rem;
    height: 5rem;
    position: absolute;
    bottom: 2.3rem;
    z-index: -1;
  }
  //cd上图片
  .img_ar {
    width: 3.2rem;
    height: 3.2rem;
    border-radius: 50%;
    position: absolute;
    bottom: 3.14rem;
    animation: rotate_ar 10s linear infinite;
  }
  //控制cd旋转动画是否暂停启动
  //启动
  .img_ar_active {
    animation-play-state: running;
  }
  //暂停
  .img_ar_pauesd {
    animation-play-state: paused;
  }
  //cd旋转动画
  @keyframes rotate_ar {
    0% {
      transform: rotateZ(0deg);
    }
    100% {
      transform: rotateZ(360deg);
    }
  }
}
//歌词部分样式
.musicLyric {
  width: 100%;
  height: 8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0.2rem;
  overflow: scroll;
  p {
    color: rgb(190, 181, 181);
    margin-bottom: 0.3rem;
  }
  .active {
    color: #fff;
    font-size: 0.5rem;
  }
}
.detailFooter {
  width: 100%;
  height: 3rem;
  position: absolute;
  bottom: 0.2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .footerTop {
    width: 100%;
    height: 1rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .icon {
      width: 0.36rem;
      height: 0.36rem;
      fill: rgb(245, 234, 234);
    }
    .icon {
      width: 0.6rem;
      height: 0.6rem;
    }
  }
  //进度条样式
  .range {
    width: 100%;
    height: 0.06rem;
  }
  .footer {
    width: 100%;
    height: 1rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .icon {
      fill: rgb(245, 234, 234);
    }
    .bofang {
      width: 1rem;
      height: 1rem;
    }
  }
}
</style>