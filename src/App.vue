<template>
  <div id="fullscreen-body">
    <div v-if="!shouldDisplayContent" class="rotate-message">
      <div class="gifRotate">
        <img
          src="@/assets/rotate-your-smartphone.gif"
          alt="Rotate-GIF"
          draggable="false"
        />
      </div>
      <div class="messageRotate">
        Please rotate your device for better display
      </div>
    </div>
    <div
      id="flexible-fullscreen-body"
      :style="{ height: windowHeight + 'px', width: windowWidth + 'px' }"
    >
      <div id="layout" ref="scaled">
        <div class="canvas-bg">
            <div class="effect-wrap">
              <router-view />
            </div>
        </div>
        <div id="frame">
            <div class="container-nav">
              <div class="sub-container-nav">
                <div v-if="!isFinalGame" class="sub-sub-container-nav">
                  <!-- <div class="navleft">
                    <a
                      href="https://forms.gle/uriQDdGjLxBygpgn9"
                      target="_blank"
                      draggable="false" 
                      ondragstart="return false;"
                      class="Nav"
                    >
                      <img
                        src="@/assets/exit_btn.png"
                        alt="LOGO"
                        draggable="false"
                        ondragstart="return false;"
                      />
                    </a>
                  </div> -->
                  <div class="navright">
                    <a @click="playMusic" class="Nav margin-nav"
                      ><img
                        draggable="false"
                        ondragstart="return false;"
                        :src="
                          isPlaying
                            ? getSrc(btnAudio.playNav)
                            : getSrc(btnAudio.muteNav)
                        "
                        alt="Play/Pause"
                    /></a>
                    <router-link
                      v-if="!isGame && !isHome"
                      to="/Home"
                      class="Nav margin-nav"
                      draggable="false"
                      ondragstart="return false;"
                      ><img
                        src="@/assets/exit_btn.png"
                        alt="Home"
                        draggable="false"
                    /></router-link>
                    <a v-if="isGame" @click="toggleMenuForGame"  draggable="false" class="Nav margin-nav"
                      ><img src="@/assets/exit_btn.png" alt="Exit" draggable="false" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Howl } from "howler";
// import { gsap } from "gsap";
import HomeMusic from '@/assets/music/home.mp3';
import SportAndGameMusic from '@/assets/music/playful.mp3';

export default {
  data() {
    return {
      isFinalGame: false,
      isPlaying: true,
      MasterPlaying: true,
      isListening: false,
      shownav: true,
      music: null,
      isGame: false,
      isHome: true,
      btnAudio: {
        playNav: "vol_open",
        muteNav: "vol_close",
      },
      defaultMusicLoaded: false,
      shouldDisplayContent: false,
      shownavHome: true,
      shownavthx: true,
      shownavAbs: true,
      windowHeight: 0,
      windowWidth: 0,
      currentMusic:null,
      audefault:HomeMusic,
      SportAndGameMusic:SportAndGameMusic,
    };
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },

  async mounted() {
    //Event
    this.emitter.on("stopBGMusic", (bool) => {
      if(bool){
          if (this.music && this.music.playing()) {
          this.isPlaying = false;
          this.music.pause();
        }
      }

    });

    this.emitter.on("SentFinal", (bool) => {
      this.isFinalGame = bool;

    });

    // Check the initial screen orientation
    this.checkOrientation();

    // this.requestPermission();
    this.preserveAspect();
    window.addEventListener("resize", this.preserveAspect);

    // Listen for changes to the screen orientation
    window.addEventListener("orientationchange", this.checkOrientation);
    window.addEventListener("resize", this.checkOrientation);

    // Load the default music
    const musicPlaying = localStorage.getItem("musicPlaying");
    if (musicPlaying === "true") {
      await this.loadMusic(this.audefault);
      this.MasterPlaying = true;
      this.isPlaying = true;
    } else {
      localStorage.setItem("musicPlaying", "false"); // Set default value if not present in local storage
      this.isPlaying = false;
      this.MasterPlaying = false;
    }
  },
  beforeUnmount() {
    // Remove the event listeners when the component is unmounted
    window.removeEventListener("orientationchange", this.checkOrientation);
    window.removeEventListener("resize", this.checkOrientation);
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("resize", this.preserveAspect);
  },
  watch: {
    // Watch for changes to the route and load the appropriate music
    async $route(to) {
      switch (to.path) {
        case "/":{
          await this.loadMusic(this.audefault);
          this.isGame = false;
          this.isHome = true;
          break;
        }
        case "/Home":{
          await this.loadMusic(this.audefault);
          this.isGame = false;
          this.isHome = true;
          break;
        }
        case "/Category":{
          await this.loadMusic(this.audefault);
          this.isGame = false;
          this.isHome = false;
          break;
        }  
        case "/SportsAndGameWords":{
          await this.loadMusic(this.SportAndGameMusic);
          this.isGame = true;
          this.isHome = false;
          let lessonGuid = "unit07";
          sessionStorage.setItem('lessonGuid', JSON.stringify(lessonGuid));
          break;
        }
        case "/SportsAndGameConversation":{
          await this.loadMusic(this.SportAndGameMusic);
          this.isGame = true;
          this.isHome = false;
          let lessonGuid = "unit07Conver";
          sessionStorage.setItem('lessonGuid', JSON.stringify(lessonGuid));
          break;
        }
        case "/Report":{
          await this.loadMusic(this.audefault);
          this.isGame = false;
          this.isHome = false;
          break;
        }
        default:{
          this.isGame = false;
          break;
        }
      }
    },
  },
  methods: {
    toggleMenuForGame() {
      this.emitter.emit("toggleMenuForGame", true);
    },

    checkOrientation() {
      // Check if the screen is wider than it is tall 
      this.shouldDisplayContent = window.innerWidth > window.innerHeight;
    },
    handleResize() {
      this.windowHeight = window.innerHeight ;
      this.windowWidth = window.innerWidth;
    },
    preserveAspect() {
      const scaled = this.$refs.scaled;
      scaled.style.height = "100%";
      scaled.style.width = "100%";
      scaled.style.boxSizing = "border-box";
      const ratio = 16 / 8;
      const w = scaled.offsetWidth;
      const h = scaled.offsetHeight;

      if (w > ratio * h) {
        scaled.style.width = ratio * h * 1.1 + "px";
        // horizontal centering is done using margin:auto in CSS
      } else if (h > w / ratio) {
        const newHeight = w / ratio;
        scaled.style.height = newHeight + "px";
        // for vertical centering:
        // scaled.style.marginTop = (window.innerHeight - newHeight) / 2 + "px";
      }
    },

    getSrc(name) {
      var images = require.context("@/assets/", false, /\.png$/);
      return images("./" + name + ".png");
    },

    playMusic() {
      // Change Icons
      // this.isPlaying = !this.isPlaying;
      // If music is playing, pause it
      if (this.music && this.music.playing()) {
          this.isPlaying = false;
          this.MasterPlaying = false;
          this.music.fade(this.music.volume(), 0, 1000);
          this.music.once("fade", () => {
            this.music.pause();

            localStorage.setItem("musicPlaying", "false"); // Store the state in local storage
          });
        } else {
          // If music is paused or not loaded, play it
          if (this.music) {
            if(this.currentMusic === this.audefault){
              this.isPlaying = true;
              this.MasterPlaying = true;
              this.music.fade(0, 1, 2000);
              this.music.play();
            }else{
              this.isPlaying = true;
              this.MasterPlaying = true;
              this.music.fade(0, 0.2, 2000);
              this.music.play();
            }

            localStorage.setItem("musicPlaying", "true"); // Store the state in local storage
          } else {
            this.loadMusic(this.audefault);
            localStorage.setItem("musicPlaying", "true"); // Store the state in local storage
          }
        }
      
    },

    loadMusic(src) {
      this.currentMusic = src;
      // If default music is already loaded, do not load it again
      if (src === this.audefault && this.defaultMusicLoaded) {
        return;
      }

      if (this.music) {
        this.music.stop();
      }

      const musicPlaying = localStorage.getItem("musicPlaying");
      const shouldPlayMusic = musicPlaying === "true";

      if(src === this.audefault){
        this.music = new Howl({
          src: [src],
          loop: true,
          autoplay: shouldPlayMusic,
          volume: 0.3,
        });
      }else{
        this.music = new Howl({
          src: [src],
          loop: true,
          autoplay: shouldPlayMusic,
          volume: 0.2,
        });
      }
      

      if (shouldPlayMusic) {
        this.music.play();
      }

      // Set defaultMusicLoaded to true if loading the default music
      if (src === this.audefault) {
        this.defaultMusicLoaded = true;
      }
    },
  },
};
</script>

<style>
/* @import url('https://fonts.googleapis.com/css2?family=K2D:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap'); */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family:"balloo tamma", sans-serif;
  outline: none;
}
*:focus {
  outline: none;
}


#fullscreen-body {
  margin: 0px;
  position: fixed;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

#flexible-fullscreen-body {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

#layout {
  position: relative;
  
}

.canvas-bg {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-image: url("@/assets/textureBg.png");
  background-repeat: repeat;
  background-size:50%;
  background-color: rgba(241, 241, 241, 1);
  background-position: center;
}
.effect-wrap {
  width: 100%;
  height: 100%;

  position: relative;
}

#frame {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  pointer-events: none;
}
.container-nav {
  position: relative;
  width: 100%;
  height: 100%;
}
.sub-container-nav {
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 102;
}
.sub-sub-container-nav {
  top: 0;
  position: sticky;
  position: -webkit-sticky;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 15%;
  width: 100%;
}

.navright {
  height: 60%;
  width: auto;
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-right: 5%;
  gap: 20px;
}

.navright a:focus {
  outline: none !important;
  box-shadow: none;
}

.navleft {
  position: relative;
  height: 60%;
  width: auto;
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;

  margin-left: 5%;
}

.Nav {
  width: auto;
  height: 100%;
  background-size: contain;
  background-repeat: no-repeat;
  cursor: pointer;
  -webkit-touch-callout: none;
  -ms-touch-action: none;
  touch-action: none;
}

.Nav img {
  width: auto;
  height: 100%;
  object-fit: scale-down;
}
.rotate-message {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #32373a;
  padding: 20px;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 1050;
}
.gifRotate {
  width: 30%;
  height: auto;
}
.gifRotate img {
  width: 100%;
  height: 100%;
  object-fit: scale-down;
}
.messageRotate {
  margin-top: 2%;
  color: white;
  font-family: "Prompt", sans-serif;
  font-size: 3vw;
}
</style>
