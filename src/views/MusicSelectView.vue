<template>
  <canvas v-if="!isLoading" ref="canvas"></canvas>
</template>

<script>
import { MusicSelectManager } from "@/game/scene/musicSelect/MusicSelectManager";
import { BmsHeader } from "@/game/domain/bms/BmsHeader";
import { Assets, extensions, ExtensionType, Texture } from "pixi.js";
import { Howl } from "howler";

export default {
  name: "MusicSelectView",
  data() {
    return {
      isLoading: true,
      bmsList: [],
    };
  },
  async mounted() {
    await this.loadAll();
    const debug = this.$route.query.debug || "N";
    const canvas = this.$refs.canvas;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.musicSelectManager = new MusicSelectManager(
      canvas,
      this,
      this.bmsList,
      this.sounds,
      Boolean(debug.toLowerCase() === "y")
    );
  },
  methods: {
    async loadAll() {
      this.isLoading = true;
      this.bmsList = await this.loadBmsLists();
      await this.loadBmsBmp01();
      await this.loadFonts();
      await this.loadSounds();
      this.isLoading = false;
    },

    async loadBmsLists() {
      const response = await fetch("http://localhost:5002/bms/list");
      const body = await response.json();
      return body.map((json) => new BmsHeader(json));
    },

    async loadBmsBmp01() {
      this.setImageExtension();

      Assets.add(
        "default",
        "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
      );
      await Assets.load("default");
      for (let i = 0; i < this.bmsList.length; i++) {
        try {
          Assets.add(
            "bmp01_" + this.bmsList[i].id,
            "http://localhost:5002/download/bms/bmp01/" + this.bmsList[i].id
          );
          await Assets.load("bmp01_" + this.bmsList[i].id, () => {
            console.log(i + "/" + this.bmsList.length);
          });
        } catch (e) {
          /* empty */
        }
      }
    },

    async loadFonts() {
      WebFont.load({
        google: {
          families: ["Aldrich", "Electrolize", "Changa", "Orbitron"],
        },
      });
    },

    async loadSounds() {
      this.sounds = {
        beep: new Howl({ src: ["assets/sound/beep1.wav"] }),
        select: new Howl({ src: ["assets/sound/select.wav"] }),
      };
    },

    setImageExtension() {
      const imageDelivery = {
        extension: ExtensionType.LoadParser,
        test: (url) => url.startsWith("http://localhost:5002"),
        async load(src) {
          // eslint-disable-next-line no-unused-vars
          return new Promise((resolve, reject) => {
            resolve(Texture.fromURL(src));
          });
        },
      };
      extensions.add(imageDelivery);
    },
  },
};
</script>

<style scoped></style>
