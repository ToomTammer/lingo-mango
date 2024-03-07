<template>
  <PageLoader />
  <div id="webglCanvas" ref="container"></div>
  <div class="effect-hot-spot">
    <div class="loading-tips"></div>
    <div class="home-wrap">
      <div class="container-rl">
        <div class="container-rl">
          <div class="sub-container-rl">
            <div class="gesture" ref="containerVI"></div>
              <div class="label">
                  <div class="txtArea">
                    <div class="txt">Player: {{playerName}}</div>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script >
import { gsap } from "gsap";
import * as THREE from "three";
import PageLoader from "@/components/PageLoader.vue";
import cateJson from '@/resource/catgatories.json';
import Hammer from "hammerjs";

export default {
  components: {
    PageLoader,
  },
  data() {
    return {
      isRestartNewGame : false,
      music: null,
      IsAble : true,
      isloaded: false,
      imagesCateUnit7 : cateJson[0].unit7,
      texturesCateUnit7:[],
      textureCateUnit7No: 0,
      playerName: '',
      opacityAll: 0,
      scaleUnit71: 1.5,
      scaleUnit72: 0.7,
      scaleUnit73: 0.7,

      sceneZ : -1,
      sceneY : 0,

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
    this.animatestart();
    await this.GetPlayerName();
    await this.setTextures('imagesCateUnit7','catagories/','texturesCateUnit7');
    console.log("imagesCateUnit7", this.imagesCateUnit7 );

    window.addEventListener("load", (event) => {
      if (event.target.readyState === "complete") {
        console.log("load complete" );
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
    const initialTextureUnit71 = this.texturesCateUnit7[this.textureCateUnit7No];
    const initialTextureUnit72 = this.texturesCateUnit7[this.textureCateUnit7No +1];
    const initialTextureUnit73 = this.texturesCateUnit7[this.textureCateUnit7No +2];
    const initialTextureUnit74 = this.texturesCateUnit7[this.textureCateUnit7No +1];
    const initialTextureUnit75 = this.texturesCateUnit7[this.textureCateUnit7No +3];



    // Unit71
    const materialUnit71 = new THREE.MeshBasicMaterial({
      map: initialTextureUnit71,
      side:THREE.DoubleSide,
      transparent: true,
      opacity: 1 });
    const CardUnit71 = new THREE.Mesh(
      new THREE.PlaneGeometry(this.scaleUnit71, this.scaleUnit71),
      materialUnit71);
    scene.add(CardUnit71);

    // bgUnit72
    const materialUnit72 = new THREE.MeshBasicMaterial({
      map: initialTextureUnit72,
      side:THREE.DoubleSide,
      transparent: true,
      opacity: 1 });
    const CardUnit72 = new THREE.Mesh(
      new THREE.PlaneGeometry(this.scaleUnit72, this.scaleUnit72),
      materialUnit72);
    scene.add(CardUnit72);
    CardUnit72.position.x = -0.4;
    CardUnit72.position.y = -0.1;

    // Unit73
    const materialUnit73 = new THREE.MeshBasicMaterial({
      map: initialTextureUnit73,
      side:THREE.DoubleSide,
      transparent: true,
      opacity: 1 });
    const CardUnit73 = new THREE.Mesh(
      new THREE.PlaneGeometry(this.scaleUnit73, this.scaleUnit73),
      materialUnit73);
    scene.add(CardUnit73);
    CardUnit73.position.x = -0.4;
    CardUnit73.position.y = 0;

     // bgUnit74
     const materialUnit74 = new THREE.MeshBasicMaterial({
      map: initialTextureUnit74,
      side:THREE.DoubleSide,
      transparent: true,
      opacity: 1 });
    const CardUnit74 = new THREE.Mesh(
      new THREE.PlaneGeometry(this.scaleUnit72, this.scaleUnit72),
      materialUnit74);
    scene.add(CardUnit74);
    CardUnit74.position.x = 0.4;
    CardUnit74.position.y = -0.1;

    // Unit75
    const materialUnit75 = new THREE.MeshBasicMaterial({
      map: initialTextureUnit75,
      side:THREE.DoubleSide,
      transparent: true,
      opacity: 1 });
    const CardUnit75 = new THREE.Mesh(
      new THREE.PlaneGeometry(this.scaleUnit73, this.scaleUnit73),
      materialUnit75);
    scene.add(CardUnit75);
    CardUnit75.position.x = 0.4;
    CardUnit75.position.y = 0;


    //Object End

     // Add swipe gesture recognition with Hammer.js
    //  const vm = this; // capture the Vue component instance
    const mc = new Hammer.Manager(this.$refs.containerVI);
    mc.add(
      new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 0 })
    );

    mc.on("pan", function (ev) {
      // Update the X position of the camera based on the swipe gesture

      if (ev.direction === Hammer.DIRECTION_LEFT) {
        cameraX -= 0.03;
      } else if (ev.direction === Hammer.DIRECTION_RIGHT) {
        cameraX += 0.03 ;
      }
    });
    // create the parallax effect
      // initialize raycaster and mouse
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      const mouse2 = new THREE.Vector2();

      document.addEventListener("mousemove", (event) => {
          // calculate normalized device coordinates (-1 to 1) for mouse position
          const rect = container.getBoundingClientRect();
          mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
          mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

          // set the cursor style to 'pointer' if an object is being hovered over
          raycaster.setFromCamera(mouse, this.camera);
          // const intersects = raycaster.intersectObjects(scene.children);
          const intersects = raycaster.intersectObjects([CardUnit72, CardUnit74]); // check for both cubes
          if (intersects.length > 0) {
            if (
              intersects[0].object === CardUnit72 || intersects[0].object === CardUnit74
            ) {
              document.body.style.cursor = "pointer";
            }
          } else {
            document.body.style.cursor = "default";
          }

        });

      // add event listener to container for mouse click
      document.addEventListener("click", async (event) => {
        // calculate normalized device coordinates (-1 to 1) for mouse2 position
        const rect = container.getBoundingClientRect();
        mouse2.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse2.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // set the cursor style to 'default' after the click
        document.body.style.cursor = "default";

        // update the raycaster with the mouse2 position
        raycaster.setFromCamera(mouse2, this.camera);

        // get the intersecting object(s)
        const intersects = raycaster.intersectObjects([CardUnit72, CardUnit74]); // check for both cubes

        // log "cube" if the first cube is clicked, or "cube2" if the second cube is clicked
        if (intersects.length > 0) {
          if (intersects[0].object === CardUnit72 && this.IsAble) {
            console.log("Click img Option1");
            this.goToWordsUnit7();
          }
          if (intersects[0].object === CardUnit74 && this.IsAble) {
            console.log("Click img Option2");
          }
        }
      });

    // render the scene
    const render = () => {
      requestAnimationFrame(render);
      if (this.isListening){
        let bufferLength = this.analyser.frequencyBinCount;
        let dataArray = new Uint8Array(bufferLength);
        this.analyser.getByteFrequencyData(dataArray);
        const level = Math.max.apply(null, dataArray);
        this.scaleBgMic = level / 150;
        console.log("isListening", true);
      }

      const currentTime = Date.now();
      if (currentTime - lastFrameTime > frameDuration) {
        lastFrameTime = currentTime;

        // Update texture
        // frameIndex = (frameIndex + 1) % this.textures.length;
        // cardOpt1.material.map = textures[frameIndex];
        // cardOpt1.material.needsUpdate = true;
      }

      CardUnit71.scale.set(this.scaleUnit71, this.scaleUnit71);
      CardUnit71.material.opacity = this.opacityAll;

      CardUnit72.scale.set(this.scaleUnit72, this.scaleUnit72);
      CardUnit72.material.opacity = this.opacityAll;

      CardUnit73.scale.set(this.scaleUnit73, this.scaleUnit73);
      CardUnit73.material.opacity = this.opacityAll;

      CardUnit74.scale.set(this.scaleUnit72, this.scaleUnit72);
      CardUnit74.material.opacity = this.opacityAll;

      CardUnit75.scale.set(this.scaleUnit73, this.scaleUnit73);
      CardUnit75.material.opacity = this.opacityAll;


      // Smoothly move the camera along the X-axis
      this.camera.position.x += (-cameraX - this.camera.position.x) * 0.05;
      this.camera.position.z += (-cameraZ - this.camera.position.z) * 0.05;
      this.camera.position.y += (-cameraY - this.camera.position.y) * 0.1;
      if (cameraX >= 0 || cameraX <= 0) {
        cameraX = 0;
      }

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
      console.log("###setTextures");
      const textureLoader = new THREE.TextureLoader();
      this[data].forEach(item => {
        const imgPath = require('@/assets/' + path + item.img);
        const texture = textureLoader.load(imgPath);
        texture.encoding = THREE.sRGBEncoding;
        this[containerName].push(texture);
      });

      console.log("setTextures",this[data]);
      console.log("setTextures Complete");
    },

    async GetPlayerName(){
    this.playerName = await JSON.parse(sessionStorage.getItem('playerName')) || '';
    },

    animatestart() {
      window.addEventListener("load", (event) => {
        if (event.target.readyState === "complete") {
          gsap.to(this.$data, {
            duration: 2,
            opacityAll: 1,
          });
          gsap.to('.label', {
            duration: 2,
            opacity: 1,
          });
        }
      });
    },

    goToWordsUnit7() {
      let isRestartNewGame = true;
      sessionStorage.setItem('isRestartNewGame', JSON.stringify(isRestartNewGame));
      this.$router.push("/SportsAndGameWords");
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
    opacity: 0;
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
  position: absolute;
  height: 100%;
  width: 100%;
}

.animateOpacity{
  opacity: 0;
}

</style>