<template>
  <transition name="fade">
    <canvas v-if="!isLoading" ref="canvas"></canvas>
  </transition>
  <LoadingComponent v-if="isLoading" />
</template>

<script>
import { GameManager } from "@/game/scene/game/GameManager";
import LoadingComponent from "./LoadingComponent.vue";
import { Howl } from "howler";

export default {
  name: "GameView",
  components: { LoadingComponent },
  data() {
    return {
      isLoading: true,
      bmsId: null,
      parsedBms: null,
      bmsSounds: new Map(),
      sounds: null,
    };
  },
  async mounted() {
    this.bmsId = this.$route.query.id;
    await this.loadAll();
    const key = this.$route.query.key || 7; // fixme
    const debug = this.$route.query.debug || "Y";
    const canvas = this.$refs.canvas;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    console.log("initializing GameManager...");
    // this.gameManager = new GameManager(
    //   canvas,
    //   this,
    //   key,
    //   this.parsedBms,
    //   this.bmsSounds,
    //   this.sounds,
    //   Boolean(debug.toLowerCase() === "y")
    // );
  },
  methods: {
    async loadAll() {
      try {
        this.isLoading = true;
        await this.loadBms();
        await this.loadFonts();
        await this.loadSounds();
        this.isLoading = false;
      } catch (e) {
        // todo handle when failed to load parsed bms
        console.error(e);
      } finally {
        this.isLoading = false;
      }
    },

    async loadBms() {
      if (!this.bmsId) {
        throw new Error("no bmsId");
      }

      const response = await fetch("http://localhost:5002/bms/" + this.bmsId);
      const body = await response.json();
      console.log("bms : ", body);

      if (!body.isParsed) {
        throw new Error("failed to get parsed bms");
        return;
      }

      this.parsedBms = body.bms;
    },

    async loadFonts() {
      WebFont.load({
        google: {
          families: ["Aldrich", "Electrolize", "Changa", "Orbitron"],
        },
      });
    },

    async loadSounds() {
      console.log("parsedBms = ", this.parsedBms);

      const header = this.parsedBms.bmsHeader;
      // download extra sounds
      this.sounds = {
        start: new Howl({ src: ["assets/sound/start.m4a"] }),
        beep: new Howl({ src: ["assets/sound/beep2.wav"] }),
      };

      // download bms sounds
      header.wav.forEach((soundFile) => {
        if (!soundFile) {
          return;
        }

        this.bmsSounds.set(
          soundFile,
          new Howl({
            src: [
              "http://localhost:5002/download/bms/sound/" +
                this.bmsId +
                "/" +
                soundFile,
            ],
          })
        );
      });
    },
  },
};
</script>

<style scoped>
canvas {
  margin: 0;
  padding: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
