<template>
  <div style="user-select: none; height: 100vh; top:0px; position: absolute; width: 100%;">
    <div class="header">
      <div class="logo">
        <img src="@/assets/logo/logo.png" alt="logo">
        <span>挖矿游戏</span>
      </div>
      <div class="function">
        <el-dropdown style="top:20px; margin-right:24px" size="large">
          <span>
            <translate theme="outline" size="24" fill="#333" />
          </span>
          <template #dropdown>
            <el-dropdown-item>中文</el-dropdown-item>
            <el-dropdown-item>English</el-dropdown-item>
          </template>
        </el-dropdown>
        <el-switch v-model="isDark" inline-prompt :active-icon="Moon" :inactive-icon="Sunny" size="large"
          style="margin-right: 24px"></el-switch>
        <el-button type="info" size="large">
          <el-icon>
            <InfoFilled />
          </el-icon>关于
        </el-button>
        <el-button type="danger" size="large"><el-icon>
            <SwitchButton />
          </el-icon>注销</el-button>
      </div>
    </div>
    <div class="main">
      <router-view />
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { SwitchButton, Sunny, Moon, InfoFilled } from '@element-plus/icons-vue'
import { Translate } from '@icon-park/vue-next'
const isDark = ref(false)
</script>
<style scoped>
.header {
  height: 60px;
  line-height: 60px;
  background-color: white;
  display: flex;
  margin-bottom: 20px;
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
}

.logo img {
  left: 20px;
  top: 10px;
  position: relative;
}

.logo span {
  left: 20px;
  position: relative;
}

.function {
  flex: 1;
  text-align: right;
  padding-right: 20px
}
.main{
  display: flex;
  margin-left: 100px;
  margin-right: 100px;
  height: calc(100vh - 110px);
  background-color: white;
}
</style>