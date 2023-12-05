<template>
  <v-app style="background-color: #263238;">
    <v-main style="overflow: hidden;">
        <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {};
  },
};
</script>
<style>
*{
  overflow: hidden;
}
</style>

