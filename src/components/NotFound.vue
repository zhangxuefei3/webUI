<template>
  <div>
    <h1>未找到页面</h1>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  mounted() {
    console.warn('Page Not Found: ', this.$route.path)
    this.$router.replace('/')
  }
}
</script>
