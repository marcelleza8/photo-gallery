<template>
  <div class="image-gallery overflow-x-scroll flex space-x-2">
    <div
      v-for="(image, idx) in images"
      :key="idx"
      @click="handleClick(image)"
      class="inline-block relative"
    >
      <span class="absolute bottom-0 text-red-500">{{ image.id }}</span>
      <img :src="image[index]" class="cursor-pointer" />
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

const { images } = defineProps(["images", "index"]);
const emit = defineEmits(["imageClicked"]);

const modalAberto = ref(false);

const handleClick = (image) => {
  emit("imageClicked", image);
};
</script>
