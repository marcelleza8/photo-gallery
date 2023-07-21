<template>
  <TakePic @snap="picture" />
  <Gallery :images="images"/>
</template>
<script setup>
import { ref } from "vue";
import TakePic from "../Components/TakePic.vue";
import Gallery from "../Components/Gallery.vue";

const pic = ref("");
const images = ref([]);

const picture = (image) => {
  images.value.push(image);
};
</script>
<style scoped></style>
