<template>
  <PageLoader />
  <div v-if="!shouldDisplayContent" class="openVolumn-message">
    <div class="VolRotate">
      <img
        src="@/assets/mingcute_volume-fill.png"
        alt="Rotate-GIF"
        draggable="false"
      />
    </div>
    <div class="messageVol">
      🔊 Open Volume for Full Gaming Experience! 🔊
    </div>
    <img
        class="btn-message"
        src="@/assets/okbtn.png"
        alt="ok-botton"
        draggable="false"
        @click="openvolume"
      />
  </div>
  <div id="webglCanvas" ref="container"></div>
  <div class="effect-hot-spot">
    <div class="home-wrap">
      <div class="container-rl">
        <div class="container-rl">
          <div class="sub-container-rl">
            <div class="gesture" ref="containerVI"></div>
          </div>
          <InputNameView class="animateOpacity" v-if="animateLogoComplete"  @playerName="sessionStoragePlayerData" ></InputNameView>
        </div>
      </div>
    </div>
  </div>
</template>


<script >
import { gsap } from "gsap";
import * as THREE from "three";
import PageLoader from "@/components/PageLoader.vue";
import InputNameView from "@/components/InputNameView.vue";
// import Hammer from "hammerjs";

import logoJson from '@/resource/logo.json';


export default {
  components: {
    InputNameView,
    PageLoader,
  },
  data() {
    return {
      shouldDisplayContent: false,
      isLogoComplete: false,
      isRestartNewGame : false,
      music: null,
      VoiceLoaded : false,
      isVoicePlaying : false,
      isloaded: false,
      animateLogoComplete: false,

      playerName: '',

      sceneZ : -1,
      sceneY : 0,

      isVisibleLogo: true,
      scaleLogo1: 1.5,
      scaleLogo2: 1.5,
      scaleLogo3: 1.5,
      scaleLogo4: 1.5,
      scaleLogo5: 1.5,
      scaleLogo6: 1.5,
      scaleLogo7: 1.5,
      scaleLogo8: 1.5,
      scaleLogo9: 1.5,
      scaleLogo10: 1.5,
      LogoOpacity1:0,
      LogoOpacity2:0,
      LogoOpacity3:0,
      LogoOpacity4:0,
      LogoOpacity5:0,
      LogoOpacity6:0,
      LogoOpacity7:0,
      LogoOpacity8:0,
      LogoOpacity9:0,
      LogoOpacity10:0,
      textureCardOpt4: 0,
      texturelogoNo: 0,
      texturesLogo:[],
      imagesLogo : logoJson.images,
      speedCameraX: 0.03,

    };
  },
  created() {
    // Reload the page once
    if (!sessionStorage.getItem("isReloaded")) {
      sessionStorage.setItem("isReloaded", true);
      window.location.reload();
    } else {
      sessionStorage.removeItem("isReloaded");
    }
  },
  async mounted() {
    await this.setTextures('imagesLogo','logo/','texturesLogo');

    window.addEventListener("load", (event) => {
      if (event.target.readyState === "complete") {
        // console.log("load complete" );
      }
    });

    let container = document.getElementById("webglCanvas");
    let width = container.clientWidth;
    let height = container.clientHeight;
    // create the scene
    const scene = new THREE.Scene();

    // create the camera
    let cameraX = 0; // initialize the X position of the camera
    let cameraZ = 0; // initialize the Z position of the camera
    let cameraY = 0; // initialize the Y position of the camera

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    scene.position.z = this.sceneZ;
    scene.position.y = this.sceneY;
    // scene.position.y = 0.1;

    // create the renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.domElement.addEventListener("webglcontextlost", function () {
      location.reload();
    });

    renderer.setSize(container.clientWidth, container.clientHeight);
    this.$refs.container.appendChild(renderer.domElement);


    //Object Start

    // Animation variables
    // let frameIndex = 0;
    const frameDuration = 200; // Milliseconds per frame
    let lastFrameTime = 0;

    // Load textures
    const initialTextureLogo1 = this.texturesLogo[this.texturelogoNo];
    const initialTextureLogo2 = this.texturesLogo[this.texturelogoNo +1];
    const initialTextureLogo3 = this.texturesLogo[this.texturelogoNo +2];
    const initialTextureLogo4 = this.texturesLogo[this.texturelogoNo +3];
    const initialTextureLogo5 = this.texturesLogo[this.texturelogoNo +4];
    const initialTextureLogo6 = this.texturesLogo[this.texturelogoNo +5];
    const initialTextureLogo7 = this.texturesLogo[this.texturelogoNo +6];
    const initialTextureLogo8 = this.texturesLogo[this.texturelogoNo +7];
    const initialTextureLogo9 = this.texturesLogo[this.texturelogoNo +8];
    const initialTextureLogo10 = this.texturesLogo[this.texturelogoNo +9];
    
    
    // logo 10
    const materialLogo10 = new THREE.MeshBasicMaterial({
      map: initialTextureLogo10,
      side:THREE.DoubleSide,
      transparent: true,
      opacity: 1 });
    const CardLogo10 = new THREE.Mesh(
      new THREE.PlaneGeometry(this.scaleLogo10, this.scaleLogo10),
      materialLogo10);
    scene.add(CardLogo10);

    // logo9
    const materialLogo9 = new THREE.MeshBasicMaterial({
      map: initialTextureLogo9,
      side:THREE.DoubleSide,
      transparent: true,
      opacity: 1 });
    const CardLogo9 = new THREE.Mesh(
      new THREE.PlaneGeometry(this.scaleLogo9, this.scaleLogo9),
      materialLogo9);
    scene.add(CardLogo9);

    // logo8
    const materialLogo8 = new THREE.MeshBasicMaterial({
      map: initialTextureLogo8,
      side:THREE.DoubleSide,
      transparent: true,
      opacity: 1 });
    const CardLogo8 = new THREE.Mesh(
      new THREE.PlaneGeometry(this.scaleLogo8, this.scaleLogo8),
      materialLogo8);
    scene.add(CardLogo8);

    // logo7
    const materialLogo7 = new THREE.MeshBasicMaterial({
      map: initialTextureLogo7 ,
      side:THREE.DoubleSide,
      transparent: true,
      opacity: 1 });
    const CardLogo7  = new THREE.Mesh(
      new THREE.PlaneGeometry(this.scaleLogo7, this.scaleLogo7),
      materialLogo7 );
    scene.add(CardLogo7 );

    // logo6
    const materialLogo6 = new THREE.MeshBasicMaterial({
      map: initialTextureLogo6,
      side:THREE.DoubleSide,
      transparent: true,
      opacity: 1 });
    const CardLogo6 = new THREE.Mesh(
      new THREE.PlaneGeometry(this.scaleLogo6, this.scaleLogo6),
      materialLogo6);
    scene.add(CardLogo6);

    // logo5
    const materialLogo5 = new THREE.MeshBasicMaterial({
      map: initialTextureLogo5,
      side:THREE.DoubleSide,
      transparent: true,
      opacity: 1 });
    const CardLogo5 = new THREE.Mesh(
      new THREE.PlaneGeometry(this.scaleLogo5, this.scaleLogo5),
      materialLogo5);
    scene.add(CardLogo5);

    // logo7
    const materialLogo4 = new THREE.MeshBasicMaterial({
      map: initialTextureLogo4,
      side:THREE.DoubleSide,
      transparent: true,
      opacity: 1 });
    const CardLogo4 = new THREE.Mesh(
      new THREE.PlaneGeometry(this.scaleLogo4, this.scaleLogo4),
      materialLogo4);
    scene.add(CardLogo4);

    // logo3
    const materialLogo3 = new THREE.MeshBasicMaterial({
      map: initialTextureLogo3,
      side:THREE.DoubleSide,
      transparent: true,
      opacity: 1 });
    const CardLogo3 = new THREE.Mesh(
      new THREE.PlaneGeometry(this.scaleLogo3, this.scaleLogo3),
      materialLogo3);
    scene.add(CardLogo3);

    // logo2
    const materialLogo2 = new THREE.MeshBasicMaterial({
      map: initialTextureLogo2,
      side:THREE.DoubleSide,
      transparent: true,
      opacity: 1 });
    const CardLogo2 = new THREE.Mesh(
      new THREE.PlaneGeometry(this.scaleLogo2, this.scaleLogo2),
      materialLogo2);
    scene.add(CardLogo2);

      // logo1
    const materialLogo1 = new THREE.MeshBasicMaterial({
      map: initialTextureLogo1,
      side:THREE.DoubleSide,
      transparent: true,
      opacity: 1 });
    const CardLogo1 = new THREE.Mesh(
      new THREE.PlaneGeometry(this.scaleLogo1, this.scaleLogo1),
      materialLogo1);
    scene.add(CardLogo1);

    //Object End

    // render the scene
    const render = () => {
      requestAnimationFrame(render);
      if (this.isListening){
        let bufferLength = this.analyser.frequencyBinCount;
        let dataArray = new Uint8Array(bufferLength);
        this.analyser.getByteFrequencyData(dataArray);
        const level = Math.max.apply(null, dataArray);
        this.scaleBgMic = level / 150;
        // console.log("isListening", true);
      }

      const currentTime = Date.now();
      if (currentTime - lastFrameTime > frameDuration) {
        lastFrameTime = currentTime;

        // Update texture
        // frameIndex = (frameIndex + 1) % this.textures.length;
        // cardOpt1.material.map = textures[frameIndex];
        // cardOpt1.material.needsUpdate = true;
      }

      CardLogo1.scale.set(this.scaleLogo1, this.scaleLogo1);
      CardLogo1.material.opacity = this.LogoOpacity1;

      CardLogo2.scale.set(this.scaleLogo2, this.scaleLogo2);
      CardLogo2.material.opacity = this.LogoOpacity2;

      CardLogo3.scale.set(this.scaleLogo3, this.scaleLogo3);
      CardLogo3.material.opacity = this.LogoOpacity3;

      CardLogo4.scale.set(this.scaleLogo4, this.scaleLogo4);
      CardLogo4.material.opacity = this.LogoOpacity4;

      CardLogo5.scale.set(this.scaleLogo5, this.scaleLogo5);
      CardLogo5.material.opacity = this.LogoOpacity5;

      CardLogo6.scale.set(this.scaleLogo6, this.scaleLogo6);
      CardLogo6.material.opacity = this.LogoOpacity6;

      CardLogo7.scale.set(this.scaleLogo7, this.scaleLogo7);
      CardLogo7.material.opacity = this.LogoOpacity7;

      CardLogo8.scale.set(this.scaleLogo8, this.scaleLogo8);
      CardLogo8.material.opacity = this.LogoOpacity8;

      CardLogo9.scale.set(this.scaleLogo9, this.scaleLogo9);
      CardLogo9.material.opacity = this.LogoOpacity9;

      CardLogo10.scale.set(this.scaleLogo10, this.scaleLogo10);
      CardLogo10.material.opacity = this.LogoOpacity10;
      
      // Smoothly move the camera along the X-axis
      this.camera.position.x += (-cameraX - this.camera.position.x) * 0.05;
      this.camera.position.z += (-cameraZ - this.camera.position.z) * 0.05;
      this.camera.position.y += (-cameraY - this.camera.position.y) * 0.1;
      scene.position.z = this.sceneZ;
      scene.position.y = this.sceneY;

      renderer.render(scene, this.camera);
    };
    render();

    window.addEventListener("resize", () => {
      width = container.clientWidth;
      height = container.clientHeight;
      renderer.setSize(width, height);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    });


  },
  methods: {

    async setTextures(data, path, containerName) {
      // console.log("###setTextures");
      const textureLoader = new THREE.TextureLoader();
      this[data].forEach(item => {
        const imgPath = require('@/assets/' + path + item.img);
        const texture = textureLoader.load(imgPath);
        texture.encoding = THREE.sRGBEncoding;
        this[containerName].push(texture);
      });
      
      // console.log("setTextures",this[data]);
      // console.log("setTextures Complete");
    },

    async sessionStoragePlayerData(data){
      this.playerName = data;
      sessionStorage.setItem('playerName', JSON.stringify(this.playerName));
      this.goToCate();
    },

    
    animateAns(card_no) {
      const ScaleOpt = this.containerScaleOpt;
      let cardNo =ScaleOpt[card_no];
      const tl = gsap.timeline();
      tl.to(this.$data, { duration: 0.2, [cardNo]: 0.6 })
        .to(this.$data, { duration: 0.2, [cardNo]: 0.8 });
    },

    animateLogo() {
      const logoTimelines = [];
      for (let i = 1; i <= 10; i++) {
          const tl = gsap.timeline();
          tl.to(this.$data, { delay: i * 0.1, duration: 0.5, [`LogoOpacity${i}`]: 1 })
            .from(this.$data, { duration: 0.5, [`scaleLogo${i}`]: 0 })
            .to(this.$data, { duration: 0.2, [`scaleLogo${i}`]: 1.2 });
          logoTimelines.push(tl);
      }
      const lastTimeline = logoTimelines[logoTimelines.length - 1];
      lastTimeline.eventCallback("onComplete", () => {
        this.animateLogoLast();
      });
    },

    animateLogoLast() {
      gsap.to(this.$data, {
        duration: 1,
        sceneY: 0.3,
        sceneZ: -1.3,
        animateLogoComplete : true,
        ease: "elastic.out(1, 1)",
        onComplete: async () => {
          gsap.to('.animateOpacity', { opacity: 1, duration: 0.5 });
        },
      });
    },
 
    goToCate() {
      this.$router.push("/Category");
    },

    PlayNavi() {
      const tl = gsap.timeline({ repeat: -1 });

      tl.to(this.$data, { duration: 2, nviOpty: 1 })
        .to(this.$data, { duration: 2, nviOpty: 1 })
        .to(this.$data, { duration: 2, nviOpty: 0 })
        .to(this.$data, { duration: 1, nviOpty: 0 });
    },

    openvolume(){
      this.shouldDisplayContent= true,
      this.animateLogo();
    },

  },
};
</script>


<style scoped>
.label{
    position: absolute;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 12%;
    /* background-color: rgba(197, 111, 111, 0.342); */
}
.txtArea{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30%;
    height: 100%;
    background-color: #195FCF;
    border-radius: 0 0 30px 30px;
}
.txt{
    color: white;
    font-size: 1.5vw;
    font-family:"balloo tamma", sans-serif;
    font-weight: 500;
}

#webglCanvas {
  position: absolute;
  left: 0;
  top: 0;
  width: 100% !important;
  height: 100% !important;
}

.effect-hot-spot {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 100;
}
.home-wrap {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
.container-rl {
  position: relative;
  width: 100%;
  height: 100%;
}
.gesture {
  height: 100%;
  width: 100%;
}

.animateOpacity{
  opacity: 0;
}

.VolRotate {
  width: 5%;
  height: auto;
}
.VolRotate img {
  width: 100%;
  height: 100%;
  object-fit: scale-down;
}
.messageVol {
  margin-top: 2%;
  color: white;
  font-family: "Prompt", sans-serif;
  font-size: 1.5vw;
}

.btn-message{
  margin-top: 20px;
  width: 5%;
  height: auto;
  cursor: pointer;
}

.openVolumn-message {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #32373a;
  padding: 20px;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

</style>