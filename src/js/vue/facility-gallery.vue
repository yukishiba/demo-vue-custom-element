<template lang="pug">
  div.gallery
    slot
    .gallery-pin.preview-img-list
      span.pin(v-for="(item, index) in items", :style="position[index]")
        img.preview-img-item(
          :class="pinClass(item.pid)",
          :src="'./images/vue/pin-map.png'",
          @click="openPhotoSwipe(index)",
          @touchstart="mEnter(item.pid) && openPhotoSwipe(index)",
          @mouseenter="mEnter(item.pid)", @mouseleave="mLeave(item.pid)",
        )
        span.tooltip {{item.title}}
</template>

<script>
import './css/gallery.scss';
export default {
  props: {
    uid: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      items: [],
      mapWidth: -320,
      mapPosition: [],
      mapEl: null,
      options: {
        fullscreenEl: true,
        history: false,
        shareEl: false,
        tapToClose: true,
        getThumbBoundsFn: () => {
          const pageYScroll =
            window.pageYOffset || document.documentElement.scrollTop;
          const pageXScroll =
            window.pageXOffset || document.documentElement.scrollLeft;
          const pageHeight = document.documentElement.clientHeight / 2;
          const pageWidth = document.documentElement.clientWidth / 2;
          return {
            x: pageXScroll + pageWidth,
            y: pageYScroll + pageHeight,
            w: 0,
          };
        },
      },
      hovering: -1,
    };
  },
  computed: {
    position() {
      const px = (val) => Math.round(val / 2) + 'px';
      return this.mapPosition.map((obj) => {
        return `top:${px(obj.top)};left:${px(obj.left)};`;
      });
    },
    enableTouch() {
      return window.ontouchend === null;
    },
  },
  mounted() {
    const allLinks = window.document.querySelectorAll('.links a');
    let index = 0;
    [].forEach.call(allLinks, (e) => {
      e.dataset.pid = index;
      index++;
    });
    this.addItems();

    // 地図サイズ
    this.mapEl = this.$el.querySelector('.map img');
    this.mapEl.addEventListener('load', this.updateImageSize);
    window.addEventListener('resize', this.updateImageSize);
  },
  methods: {
    addItems() {
      const el = this.$el.querySelectorAll('.links a');
      const list = [];
      const mapPosition = [];
      [].forEach.call(el, (e) => {
        list.push({
          src: e.attributes.href.value,
          w: e.dataset.width || 640,
          h: e.dataset.height || 480,
          title: e.innerText,
          pid: Number(e.dataset.pid),
        });
        mapPosition.push({
          top: e.dataset.top || 0,
          left: e.dataset.left || 0,
        });
        if (this.enableTouch) {
          // touch イベント対応機
          e.ontouchend = this.openLink;
          e.onclick = this.openLink;
        } else {
          e.onclick = this.openLink;
          e.onmouseover = this.pinEnter;
        }
        e.onmouseout = this.pinLeave;
      });
      this.items = list;
      this.mapPosition = mapPosition;
    },
    openPhotoSwipe(index) {
      this.$photoswipe.open(
          index, this.items, {...this.options, galleryUID: this.uid},
      );
    },
    openLink(e) {
      e.preventDefault();
      if (this.enableTouch) this.pinEnter(e);
      const target = document.querySelector('.pid-' + e.target.dataset.pid);
      target.dispatchEvent(new Event('click'));
    },
    pinClass(id) {
      const cls = [`pid-${id}`];
      if (id === this.hovering) cls.push('-active');
      return cls;
    },
    pinEnter(e) {
      this.hovering = Number(e.target.dataset.pid);
    },
    pinLeave(e) {
      this.hovering = -1;
    },
    mEnter(e) {
      this.hovering = e;
    },
    mLeave() {
      this.hovering = -1;
    },
    updateImageSize() {
      this.mapWidth = this.mapEl.width;
    },
  },
};
</script>
