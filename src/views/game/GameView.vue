<script setup>
import { Backpack, MapDraw, KeyboardOne,Success,FileFailed } from '@icon-park/vue-next'
import { Refresh, SwitchButton } from '@element-plus/icons-vue'
import request from '@/utils/request';
import { ElMessage } from 'element-plus';
import { debounce } from '@/utils/debounce';
import { ref, onMounted, onUnmounted } from 'vue';

// 加载图片
const imgbackground = require('@/assets/image/BackGround.png');
const images = [
  require("@/assets/image/TransparentPicture.png"),
  require("@/assets/image/Stone.png"),
  require("@/assets/image/Exit.png"),
  require("@/assets/image/Ball0.png"),
  require("@/assets/image/Ball1.png"),
  require("@/assets/image/Dialga.png"),
  require("@/assets/image/Meowth.png"),
  require("@/assets/image/Ampharos.png"),
];
const heroImage = [
  require("@/assets/image/Hero10.png"),
  require("@/assets/image/Hero11.png"),
  require("@/assets/image/Hero12.png"),
  require("@/assets/image/Hero20.png"),
  require("@/assets/image/Hero21.png"),
  require("@/assets/image/Hero22.png"),
  require("@/assets/image/Hero30.png"),
  require("@/assets/image/Hero31.png"),
  require("@/assets/image/Hero32.png"),
  require("@/assets/image/Hero40.png"),
  require("@/assets/image/Hero41.png"),
  require("@/assets/image/Hero42.png")
];
// 加载图片结束

//响应按钮操作
const isMapOrBag = ref(false);
const SwitchMapOrBag = () => {
  isMapOrBag.value = !isMapOrBag.value
}

//响应按钮操作结束

//响应键盘操作
const keyCodeMap = new Map([
  [87, 0],
  [83, 3],
  [65, 6],
  [68, 9],
  [38, 0],
  [40, 3],
  [37, 6],
  [39, 9],
]);
const coordinateTransformation = new Map([
  [0, [-1, 0]],
  [3, [1, 0]],
  [6, [0, -1]],
  [9, [0, 1]]
]);
const nextFoot = ref(0);
const handleKeyboardInput = (keyCode) => {
  if (keyCodeMap.has(keyCode)) {
    let direction = keyCodeMap.get(keyCode);
    if (coordinateTransformation.has(direction)) {
      let coordinateDelta = coordinateTransformation.get(direction);
      hero.orientation.value = direction + 1 + nextFoot.value;
      switch (
        map.value[
          hero.posx.value + coordinateDelta[0]
        ][hero.posy.value + coordinateDelta[1]]
      ) {
        case 0:
          hero.posx.value += coordinateDelta[0];
          hero.posy.value += coordinateDelta[1];
          switch (map.value[
          hero.posx.value + coordinateDelta[0]
        ][hero.posy.value + coordinateDelta[1]]){
          case 3:
            ElMessage.info({
              message: "这是精灵球。按E打开精灵球。",
              duration: 1000,
            });
            break;
          case 2:
            ElMessage.success({
              message: "这是出口。按E进入下一层。",
              duration: 1000,
            });
            break;
        }
          draw();
          break;
        case 1:
          ElMessage.warning({
            message: "这是墙",
            duration: 1000,
          });
          break;
        case 2:
          ElMessage.success({
            message: "这是出口。按E进入下一层。",
            duration: 1000,
          });
          break;
        case 3:
          ElMessage.info({
            message: "这是精灵球。按E打开精灵球。",
            duration: 1000,
          });
          break;
      }
    }
  }
};
let isKeyDown = false;
const gamekeydown = (event) => {
  if (!isKeyDown) {
    isKeyDown = true;
    nextFoot.value = 1 - nextFoot.value;
    handleKeyboardInput(event.keyCode);
  }
};
const gamekeyup = (event) => {
  isKeyDown = false;
  if (keyCodeMap.has(event.keyCode)) hero.orientation.value = keyCodeMap.get(event.keyCode);
  draw();
};
const mask = ref(null);
const isMaskFocused = ref(false);
const handleFocus = () => {
  isMaskFocused.value = true;
};
const handleBlur = () => {
  isMaskFocused.value = false;
};



//可交互的参数
const displayRange = ref(7);
const rowInput = ref(11);
const colInput = ref(11);
//从后端获取地图
//初始化相应变量
const row = ref(0);
const col = ref(0);
const start_pos = ref([0, 0]);
const end_pos = ref([0, 0]);
const map = ref([]);
const hero = {
  orientation: ref(0),
  posx: ref(start_pos.value[0]),
  posy: ref(start_pos.value[1]),
};

const getMaze = async () => {
  await request.get('/maze/create' + `?row=${rowInput.value}&col=${colInput.value}`).then(res => {
    console.log(res);
    map.value = res.data.maze
    start_pos.value = res.data.start_pos
    end_pos.value = res.data.end_pos
    row.value = res.data.row
    col.value = res.data.col
    hero.posx.value = start_pos.value[0]
    hero.posy.value = start_pos.value[1]
    draw()
  })
}




//canvas的绘制


const canvas = ref(null);
const canvasWidth = 32 * (2 * displayRange.value + 1);
const canvasHeight = 32 * (2 * displayRange.value + 1);

const draw = () => {
  const ctx = canvas.value.getContext('2d');
  for (let j = 0; j < 2 * displayRange.value + 1; j++) {
    for (let i = 0; i < 2 * displayRange.value + 1; i++) {
      let imgSrc;
      if (
        j - displayRange.value + hero.posy.value < 0 ||
        j - displayRange.value + hero.posy.value > col.value - 1 ||
        i - displayRange.value + hero.posx.value < 0 ||
        i - displayRange.value + hero.posx.value > row.value - 1
      ) {
        imgSrc = images[0];
      }
      else if (j == displayRange.value && i == displayRange.value) {
        imgSrc = heroImage[hero.orientation.value];
      }
      else {
        imgSrc =
          images[
          map.value[i - displayRange.value + hero.posx.value][
          j - displayRange.value + hero.posy.value
          ]
          ];
      }
      const img = new Image();
      img.src = imgSrc;
      const img0 = new Image();
      img0.src = imgbackground
      img.onload = () => {
        ctx.drawImage(
          img0,
          j * (32 * canvas.value.width / originalWidth),
          i * (32 * canvas.value.height / originalHeight),
          32 * canvas.value.width / originalWidth,
          32 * canvas.value.height / originalHeight
        );
        ctx.drawImage(
          img,
          j * (32 * canvas.value.width / originalWidth),
          i * (32 * canvas.value.height / originalHeight),
          32 * canvas.value.width / originalWidth,
          32 * canvas.value.height / originalHeight
        );
      };
    }
  }
};

//原始图片大小
const originalWidth = 32 * (2 * displayRange.value + 1)
const originalHeight = 32 * (2 * displayRange.value + 1)
//缩放
const minWidth = 800;
const minHeight = 800;
//canvas的缩放
const updateCanvasSize = () => {
  if (canvas.value) {
    const rect = canvas.value.parentElement.getBoundingClientRect();
    if (rect.width >= minWidth && rect.height >= minHeight) {
      canvas.value.width = originalWidth ;
      canvas.value.height = originalHeight ;
    } else {
      const scale = Math.min(rect.width / minWidth, rect.height / minHeight);
      canvas.value.width = originalWidth  * scale;
      canvas.value.height = originalHeight  * scale;
    }
    draw();
  }
};
const debouncedUpdateCanvasSize = debounce(updateCanvasSize, 300);
//button的缩放
const buttonSize = ref('large');
const updateButtonSize = () => {
  if (minWidth <= 600) {
    buttonSize.value = 'small';
  } else if (minWidth <= 800) {
    buttonSize.value = 'default';
  } else {
    buttonSize.value = 'large';
  }
};

onMounted(() => {
  getMaze();
  updateCanvasSize();
  window.addEventListener('resize', debouncedUpdateCanvasSize);
  updateButtonSize();
  window.addEventListener('resize', updateButtonSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', debouncedUpdateCanvasSize);
  window.removeEventListener('resize', updateButtonSize);
});
// const width = ref(window.innerWidth);
// const height = ref(window.innerHeight);

// window.addEventListener('resize', () => {
//   width.value = window.innerWidth;
//   height.value = window.innerHeight;
// });
</script>
<template>
  <div class="container">
    <div class="header">
      <el-button-group>
        <el-button @click="restart" type="warning" :size="buttonSize" :icon="Refresh" round class="responsive-button">
          <span>重新开始</span>
        </el-button>
        <el-button @click="endGame" type="danger" :size="buttonSize" :icon="SwitchButton" round class="responsive-button">
          <span>结束游戏</span>
        </el-button>
        <el-button @click="SwitchMapOrBag" :type="isMapOrBag ? 'success' : 'primary'" :size="buttonSize"
          :icon="isMapOrBag ? MapDraw : Backpack" round class="responsive-button">
          <span>{{ isMapOrBag ? '地图' : '背包' }}</span>
        </el-button>
        <el-button type="info" :size="buttonSize" :icon="KeyboardOne" round class="responsive-button">
          <span>键位设置</span>
        </el-button>
        <el-button
    :type="isMaskFocused ? 'success': 'danger'"
    :size="buttonSize"
    :icon="isMaskFocused ? Success : FileFailed"
    round
    class="responsive-button"
    disabled
  >
    <span v-if="isMaskFocused">已对焦</span>
    <span v-else>未对焦</span>
  </el-button>

      </el-button-group>

    </div>
    <div class="main" @keydown="gamekeydown" @keyup="gamekeyup" tabindex="0" @ref="mask" @focus="handleFocus" @blur="handleBlur">
        <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
    </div>
  
    
  </div>
  <!-- <div style="position: fixed;">
    窗口宽度: {{ width }}<br>
    窗口高度: {{ height }}
  </div> -->
</template>

<style scoped>
.header {
  height: 60px;
  width: 100%;
  line-height: 60px;
  background-color: white;
  display: flex;
  margin-top: 10px;
  justify-content: center;
}

.container {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  outline:none;
}

@media (max-width: 700px) {

  .responsive-button span {
    display: none;
  }
}
</style>