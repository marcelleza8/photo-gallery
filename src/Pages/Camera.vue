<template>
  <TakePic @snap="picture" />
  <Gallery :images="images" />
</template>
<script setup>
import { ref, onMounted } from "vue";
import TakePic from "../Components/TakePic.vue";
import Gallery from "../Components/Gallery.vue";

import db from "../database";

const images = ref([]);

const picture = (image) => {
  images.value.push(image);
  db.files.add({
    base64: image
  })
};

onMounted(() => {
  db.files.toArray().then((imgs) => {
    imgs.forEach((img) => {
      images.value.push(img.base64);
    });
  });
})
</script>
<style scoped></style>
