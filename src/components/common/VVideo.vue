<template>
  <video ref="video" class="video-js" />
</template>
<script>
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

export default {
  name: 'v-video',
  props: {
    options: {
      type: Object,
      default: () => {}
    },
    source: {
      type: Object,
      default: () => {}
    },
    seek: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      videojsObject: null,
      style: {}
    }
  },
  watch: {
    source() {
      console.log('VV source change: ', this.source)
      if (this.videojsObject) {
        this.videojsObject.src({
          src: this.source.src,
          type: this.source.type
        })
      }
    },
    seek() {
      console.log('VV seek change: ', this.seek)
      if (this.videojsObject) {
        this.videojsObject.currentTime(this.seek)
      }
    }
  },
  methods: {
  },
  mounted() {
    this.videojsObject = videojs(this.$refs.video, this.options, function () {
    })
  },
  updated() {
  },
  beforeDestroy() {
    if (this.videojsObject) {
      this.videojsObject.dispose()
    }
  }
}
</script>
<style lang="scss">
</style>
