<template>
  <router-view></router-view>
</template>
<script>
export default {
  data () {
    return {

    }
  },
  computed: {

  },
  mounted () {
    console.log(this.$router)
  }
}
</script>
