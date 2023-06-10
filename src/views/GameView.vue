<template>
  <transition name="fade">
    <canvas v-if="!isLoading" ref="canvas"></canvas>
  </transition>
  <LoadingComponent v-if="isLoading"/>
</template>

<script>
import {GameManager} from "../game/scene/game/GameManager";
import {Bms} from "../game/domain/bms/Bms";
import {Block} from "../game/domain/bms/Block";
import LoadingComponent from "./LoadingComponent.vue";

export default {
  name: "GameView",
  components: {LoadingComponent},
  data() {
    return {
      isLoading: true,
      bmsId: null
    }
  },
  async mounted() {
    this.bmsId = this.$route.query.id;
    await this.loadAll();
    const key = this.$route.query.key || 7; // fixme
    const debug = this.$route.query.debug || 'N';
    const canvas = this.$refs.canvas;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.gameManager = new GameManager(canvas, key, this.getParsedBms(),
        Boolean(debug.toLowerCase() === 'y'));
  },
  methods: {
    async loadAll() {
      this.isLoading = true;
      await this.loadBms();
      await this.loadFonts();
      await this.loadSounds();
      this.isLoading = false;
    },

    async loadBms() {
      if(!this.bmsId) {
        throw new Error('no bmsId');
      }

      const response = await fetch('http://localhost:5002/bms/' + this.bmsId);
      const body = await response.json();
      console.log('response : ', body);
    },

    async loadFonts() {
      WebFont.load({
        google: {
          families: ['Aldrich', 'Electrolize', 'Changa', 'Orbitron']
        }
      });
    },

    async loadSounds() {
      // todo
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 3000);
      });
    },

    getParsedBms() {
      const bms = new Bms();
      bms.blocks = [];
      for (let i = 0; i < 5000; i++) {
        bms.blocks.push(new Block(50 * (i + 1), i % 7));
      }
      return bms;
    }
  }
}
</script>

<style scoped>
canvas {
  margin: 0;
  padding: 0;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
{
  opacity: 0;
}
</style>