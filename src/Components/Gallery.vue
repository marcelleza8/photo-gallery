<template>
  <div v-if="images.length" class="flex overflow-x-auto space-x-2 bg-red-200">
    <div
      v-for="(image, idx) in images"
      :key="idx"
      @dblclick="handleClick(image)"
      class="inline-block flex-shrink-0 relative"
    >
      <span class="absolute bottom-0 bg-white/50 text-back font-semibold"
        >{{ calculateImageSize(image[index], "k").replace(".", ",") }} KB</span
      >
      <img :src="image[index]" class="cursor-pointer h-48" />
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
import { calculateImageSize } from "../Composable/useImageSize";

const { images } = defineProps(["images", "index"]);
const emit = defineEmits(["imageDblClicked"]);

const modalAberto = ref(false);

const handleClick = (image) => {
  emit("imageDblClicked", image);
};
</script>
