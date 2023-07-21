<template>
    {{ pic }}
  <TakePic @snap="picture" />
</template>
<script setup>
import { ref } from "vue";
import TakePic from "../Components/TakePic.vue";

const pic = ref("");

const picture = (image) => {
  alert("FOI")
    pic.value = image;
};
</script>
<style scoped></style>
