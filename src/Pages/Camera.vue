<template>
  <TakePic @snap="picture" />
  <Gallery :images="images" index="base64" @imageClicked="deleteImage" />
</template>
<script setup>
import { ref, onMounted } from "vue";
import TakePic from "../Components/TakePic.vue";
import Gallery from "../Components/Gallery.vue";
import _ from "lodash";

import db from "../database";

const images = ref([]);

const deleteImage = async(image) => {
  await db.files.delete(image.id);
  _.remove(images.value, item => item.id === image.id);
}

const picture = (image) => {
  db.files.add({
    base64: image
  }).then((id) => {
    console.log(db.files.get(id));
    images.value.push(db.files.get(id));
  })
};

onMounted(() => {
  db.files.toArray().then((imgs) => {
    images.value = imgs;
  });
})
</script>
<style scoped></style>
