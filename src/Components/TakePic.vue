<template>
  <div v-if="mediaDeviceSelected.id" class="alert" role="alert">
    <div class="flex">
      <div>
        <p class="font-bold">{{ mediaDeviceSelected.label }}</p>
        <p class="text-sm">Toque no X para escolher outra câmera.</p>
      </div>
    </div>
    <button
      @click="unselectDevice()"
      type="button"
      class="close bg-fuchsia-700/80 rounded px-3 py-1"
      data-dismiss="alert"
      aria-label="Close"
    >
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div>
    <slot name="subheader"></slot>
    <slot name="instructions" v-if="mediaDeviceSelected.id">
      <div class="font-bold px-3 pb-3 text-center text-black">
        Um toque na imagem para tirar uma foto
      </div>
    </slot>
  </div>
  <div class="flex justify-center flex-col">
    <div class="w-full max-w-md flex-col">
      <div class="flex justify-center mb-4 flex-col">
        <div v-if="mediaDeviceSelected.id" class="relative w-5/6 mx-auto">
          <video ref="video" @click="takePhoto" class="" autoplay></video>
          <canvas ref="canvas" class="hidden"></canvas>
          <div
            class="absolute inset-0 hidden"
            :class="{ 'flash-effect': showFlash }"
          ></div>
        </div>
        <div v-else class="max-w-xl mx-3 w-full grid place-items-center">
          <div>
            <h1 class="pb-4 text-xl">
              Selecione uma das câmeras do seu smartprone
            </h1>
            <ul
              class="divide-y divide-gray-800 bg-green-600 text-black font-bold"
            >
              <li
                @click="selectDevice(device)"
                class="py-4 px-3 cursor-pointer"
                v-for="device in mediaDevicesList"
                :key="device.id"
              >
                <div class="flex-1 space-y-1">
                  <div class="flex items-center justify-between">
                    <h3 class="text-sm font-medium">{{ device.label }}</h3>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

let props = defineProps({
  header: {
    default: "Câmera",
  },
  processing: Boolean,
  quality: {
    default: 1,
  },
});

const emits = defineEmits(["snap", "update:processing"]);

let stream = ref();
let mediaConstraint = ref({
  video: true,
});
let mediaDeviceSelected = ref({});
let mediaDevicesList = ref([]);
let video = ref(null);
let canvas = ref();
let imageUrl = ref();

const showFlash = ref(false);

const takePhoto = () => {
  emits("update:processing", true);

  if (canvas.value && video.value) {
    const ctx = canvas.value.getContext("2d");
    canvas.value.width = video.value.videoWidth;
    canvas.value.height = video.value.videoHeight;
    if (ctx) {
      ctx.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height);
    }
    imageUrl.value = canvas.value.toDataURL("image/jpg", props.quality);
    showFlash.value = true;
    emits("snap", imageUrl.value);
    setTimeout(() => {
      showFlash.value = false;
      emits("update:processing", false);
    }, 1);
  }
};

const friendlyDeviceName = (label) => {
  const cameraMatch = label.match(
    /camera(\d*)\s*(\d),\s*facing\s*(front|back)/i
  );

  if (cameraMatch) {
    const toBR = {
      front: "Frontal",
      back: "Traseira",
    };
    const cameraNumber = cameraMatch[2] ? ` ${cameraMatch[2]}` : "";
    const cameraFacing = toBR[cameraMatch[3].toLowerCase()];
    return `Câmera ${cameraFacing} ${cameraNumber}`;
  }

  if (label.includes("audioinput")) {
    return "Microphone";
  } else if (label.includes("audiooutput")) {
    return "Speaker";
  }

  return label;
};

const mediaDevices = async () => {
  stream.value = await navigator.mediaDevices.getUserMedia(
    mediaConstraint.value
  );
  stopMediaTracks();
  navigator.mediaDevices.enumerateDevices().then((devices) => {
    mediaDevicesList.value = [...devices]
      .filter((i) => i.kind == "videoinput")
      .map(({ deviceId, label, kind }) => ({
        id: deviceId,
        label: friendlyDeviceName(label),
      }));
  });
};

const startCapture = async () => {
  try {
    stopMediaTracks();
    stream.value = await navigator.mediaDevices.getUserMedia(
      mediaConstraint.value
    );
  } catch (e) {
    alert("Falha ao carregar o videoInput");
    console.error(e);
  }
  if (stream && video.value) {
    video.value.srcObject = stream.value;
  }
};

const selectDevice = (device) => {
  mediaDeviceSelected.value.id = device.id;
  mediaDeviceSelected.value.label = device.label;
  if (device.id) {
    if (mediaConstraint.value) {
      mediaConstraint.value.video = {
        deviceId: { exact: device.id },
      };
    }
  } else {
    mediaConstraint.value.video = true;
  }
  stopMediaTracks();
  startCapture();
};

const unselectDevice = () => {
  mediaDeviceSelected.value = {};
  mediaConstraint.value.video = true;
  stopMediaTracks();
};

const stopMediaTracks = () => {
  stream.value.getTracks().forEach((track) => {
    track.stop();
  });
};

onMounted(() => {
  mediaDevices();
});

onBeforeUnmount(() => {
  stopMediaTracks();
});
</script>

<style>
@keyframes flash {
  0% {
    background-color: transparent;
  }
  50% {
    background-color: white;
  }
  100% {
    background-color: transparent;
  }
}

.flash-effect {
  display: block !important;
  animation: flash 0.5s;
}

.alert {
  @apply bg-blue-100 border-t-4 border-blue-500 rounded-b text-blue-900 px-4 py-3 mb-5 shadow-md flex place-content-between;
}
</style>

<style>
.alert {
  @apply bg-blue-100 border-t-4 border-blue-500 rounded-b text-blue-900 px-4 py-3 mb-5 shadow-md flex place-content-between;
}
</style>
