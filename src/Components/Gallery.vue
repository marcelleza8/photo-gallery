<template>
  <div class="image-gallery overflow-x-scroll flex space-x-2">
    <div
      v-for="(image, index) in images"
      :key="index"
      @click="handleClick(index)"
      class="inline-block"
    >
      <img :src="image" class="cursor-pointer" />
    </div>
  </div>
  <Modal :show="modalAberto" @close="modalAberto = !modalAberto">
    <ul class="grid grid-cols-2 gap-4">
      <li v-for="image in images" class="col-span-1">
        <img class="h-64" :src="image" />
      </li>
    </ul>
  </Modal>
</template>

<script setup>
import { defineProps, defineEmits, ref } from "vue";
import Modal from "../Components/Modal.vue";

const { images } = defineProps(["images"]);
const emit = defineEmits([]);

const modalAberto = ref(false);

const handleClick = (index) => {
    modalAberto.value = true;
//   emit("imageClicked", index);
};
</script>

<style scoped>
.image-gallery {
  height: 500px; /* Altere conforme sua necessidade */
}
</style>
