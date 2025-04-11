<script setup lang="ts">

import {ref} from "vue";
import "vue3-circle-progress/dist/circle-progress.css";
import CircleProgress from "vue3-circle-progress";
import axios from "axios";
import {METRICS_TIMEOUT, SERVER_NAME, URL_API} from "../../config.ts";

import {openModal} from "../App.vue"

const name = SERVER_NAME


const loadsPercent = ref()
const res = ref()

async function fetchData() {
  try {
    const response = (await axios.get(URL_API + "/server/metrics")).data

    loadsPercent.value = {
      cpu: response.cpuPercent,
      ram: response.memory.usage / response.memory.total * 100,
      storage: response.disk.usage / response.disk.total * 100
    }

    res.value = response

  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
  }
}

// Устанавливаем интервал для выполнения fetchData каждые 3 секунды (3000 миллисекунд)
setInterval(fetchData, METRICS_TIMEOUT);


function getWindowWidth(): number {
  return window.innerWidth;
}

</script>

<template>
  <div class="system">
    <header class="header">
      <div class="main-info">
        <p class="name">{{ name }}</p>
        <p v-if="res" class="uptime">Uptime: {{ Math.ceil(res.uptime / 60**2) + " h"}}</p>
      </div>
      <a class="button" @click="openModal">
        <span class="alert">Уведомления</span>
      </a>
    </header>
    <div v-if="getWindowWidth() > 645" class="bars">
      <!--  Load CPU  -->
      <div v-if="res" class="progress-bar">
        <circle-progress
            class="progress"
            :percent="loadsPercent.cpu"
            fill-color="#14A76C"
            :border-bg-width="5"
            :border-width="5"
            empty-color="#747474"
        />
        <div class="progress-text">
          <p>CPU</p>
          <p class="load">{{ loadsPercent.cpu }}%</p>
        </div>
      </div>

      <!--  Load RAM  -->
      <div v-if="res" class="progress-bar">
        <circle-progress
            class="progress"
            :percent="loadsPercent.ram"
            fill-color="#14A76C"
            :border-bg-width="5"
            :border-width="5"
            empty-color="#747474"

        />
        <div class="progress-text">
          <p>RAM</p>
          <p class="load">{{ Math.ceil(res.memory.total) + " MB" }} /
            {{ Math.ceil(res.memory.usage) + " MB" }}</p>
        </div>
      </div>

      <!--  Load STORAGE  -->
      <div v-if="res" class="progress-bar">
        <circle-progress
            class="progress"
            :percent="loadsPercent.storage"
            fill-color="#14A76C"
            :border-bg-width="5"
            :border-width="5"
            empty-color="#747474"
        />
        <div class="progress-text">
          <p>STORAGE</p>
          <p class="load">{{ Math.ceil(res.disk.total / 1024) + " GB" }} /
            {{ Math.ceil(res.disk.usage / 1024) + " GB" }}</p>
        </div>
      </div>
    </div>
    <div v-if="getWindowWidth() <= 645 && res"  class="info">
      <div class="progress-text">
        <p class="name-metrics">CPU</p>
        <p class="load">{{ loadsPercent.cpu }}%</p>
      </div>
      <div class="progress-text">
        <p class="name-metrics">RAM</p>
        <p class="load">{{ Math.ceil(res.memory.total) + " MB" }} /
          {{ Math.ceil(res.memory.usage) + " MB" }}</p>
      </div>
      <div class="progress-text">
        <p class="name-metrics">STORAGE</p>
        <p class="load">{{ Math.ceil(res.disk.total / 1024) + " GB" }} /
          {{ Math.ceil(res.disk.usage / 1024) + " GB" }}</p>
      </div>
    </div>

  </div>
</template>

<style scoped>
.button {
  cursor: pointer;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-inline: 32px;
}

.system {
  background-color: #2D2D2D;
  max-width: 1200px;
  border-radius: 10px;

  margin-inline: auto;
}

.main-info {
  margin-top: 32px;
}

.name {
  font-size: 24px;
  color: #14A76C;
}

.uptime {
  font-size: 16px;
}

.alert {
  background-color: #2D2D2D;
  border-radius: 10px;
  margin-top: 32px;
  width: 256px;
  height: 48px;
  color: #14A76C;
  font-size: 16px;
  border: 2px solid #14A76C;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;

}

.alert:hover {
  background-color: #14A76C;
  color: #2D2D2D;
}

.progress-bar {
  display: flex;
  flex-direction: column;
  max-width: 180px;

}


.progress-text {
  transform: translateY(-110px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

}

.bars {
  display: flex;
  justify-content: space-between;
  max-width: 800px;
  margin-top: 32px;
  margin-inline: 32px;
}


@media screen and (max-width: 645px) {
  .info {
    display: flex;
    flex-direction: column;
  }
  .progress-text {
    transform: none;
    align-items: start;
    margin: 8px 8px 8px 16px;
    font-size: 14px;
  }
  .header {
    margin-inline: 16px;
  }
  .alert {
    max-width: 128px;
    font-size: 12px;
  }
  .name {
    font-size: 16px;
  }
  .uptime {
    font-size: 12px;
  }
  .name-metrics {
    color: #14A76C;
  }
}

</style>