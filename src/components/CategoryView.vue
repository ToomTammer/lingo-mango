<template>
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
                <div class="txt">player: TOOMTAM </div>
              </div>
            </div>
            <!-- <div class="sub-sub-container-rl">
              <div class="messagebtn no-select">
                คลิกเมาส์ค้างไว้แล้วลากเพื่อเลื่อนภาพ/กดแป้นพิมพ์ตัว ← →
                เพื่อควบคุมการเคลื่อนไหวของภาพ
              </div>
              <div class="rlbtn">
                <div
                  @mousedown="moveLeft = true"
                  @mouseup="moveLeft = false"
                  @mouseout="moveLeft = false"
                  @touchstart="moveLeft = true"
                  @touchend="moveLeft = false"
                  @touchcancel="moveLeft = false"
                  class="sub-rlbtn"
                >
                  <img
                    src="@/assets/box1.png"
                    alt="LEFT"
                    draggable="false"
                  />
                </div>
                <div
                  @mousedown="moveRight = true"
                  @mouseup="moveRight = false"
                  @mouseout="moveRight = false"
                  @touchstart="moveRight = true"
                  @touchend="moveRight = false"
                  @touchcancel="moveRight = false"
                  class="sub-rlbtn"
                >
                  <img
                    src="@/assets/box1.png"
                    alt="RIGHT"
                    draggable="false"
                  />
                </div>
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script >
import { gsap } from "gsap";
import * as THREE from "three";
import Hammer from "hammerjs";

import le from "@/assets/box1.png";
import frame1 from "@/assets/animationTest/frame_(1).gif";
import frame2 from "@/assets/animationTest/frame_(2).gif";
import frame3 from "@/assets/animationTest/frame_(3).gif";


export default {
  data() {
    return {
      isloaded: false,
      showbtn: true,
      speedCameraX: 0.03,

      el2:le,
      textureUrls : [frame1, frame2, frame3],


    };
  },
  components: {
    // PageLoader,
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
  mounted() {
    window.addEventListener("load", (event) => {
      if (event.target.readyState === "complete") {
        this.AnimationStart();
        this.PlayNavi();
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

    scene.position.z = -1;

    // Animation variables
    let frameIndex = 0;
    const frameDuration = 200; // Milliseconds per frame
    let lastFrameTime = 0;

    // create the renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.domElement.addEventListener("webglcontextlost", function () {
      location.reload();
    });

    renderer.setSize(container.clientWidth, container.clientHeight);
    this.$refs.container.appendChild(renderer.domElement);


    //Object Start

    // Load textures
      const textures = [];
      const textureLoader = new THREE.TextureLoader();
      this.textureUrls.forEach(url => {
        const texture = textureLoader.load(url);
        textures.push(texture);
      });
      // Create a mesh with initial texture
      const initialTexture = textures[0];
      const geometry = new THREE.PlaneGeometry(0.5, 0.5); // Adjust the size as needed
      const material = new THREE.MeshBasicMaterial({ map: initialTexture, side: THREE.DoubleSide,transparent: true, opacity: 1});
      const mesh = new THREE.Mesh(geometry, material);

      mesh.position.x = -0.4;
      scene.add(mesh);

    // // create the title cldL3 image
    // const texturecldL3 = new THREE.TextureLoader().load(cldL3);
    // const ImagecldL3 = new THREE.Mesh(
    //   new THREE.PlaneGeometry(this.cloudSize, this.cloudSize),
    //   new THREE.MeshBasicMaterial({
    //     map: texturecldL3,
    //     side: THREE.DoubleSide,
    //     transparent: true,
    //     opacity: 1,
    //   })
    // );
    // ImagecldL3.position.y = this.cloudLY;
    // ImagecldL3.position.x = this.cloudLX;
    // scene.add(ImagecldL3);

    //Object End


    // Keyboard controls
    const keyboard = {};
    window.addEventListener("keydown", (event) => {
      keyboard[event.code] = true;
    });
    window.addEventListener("keyup", (event) => {
      keyboard[event.code] = false;
    });

    // Add swipe gesture recognition with Hammer.js
    const vm = this; // capture the Vue component instance
    const mc = new Hammer.Manager(this.$refs.containerVI);
    mc.add(
      new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 0 })
    );

    mc.on("pan", function (ev) {
      // Update the X position of the camera based on the swipe gesture

      if (ev.direction === Hammer.DIRECTION_LEFT) {
        cameraX -= 0.03;
      } else if (ev.direction === Hammer.DIRECTION_RIGHT) {
        cameraX += 0.03;
        vm.elOpty += 0.05;
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
        const intersects = raycaster.intersectObjects([
        mesh,
        ]); // check for both cubes
        if (intersects.length > 0) {
          if (
            intersects[0].object === mesh &&
            mesh.visible == true
          ) {
            document.body.style.cursor = "pointer";
          }
        } else {
          document.body.style.cursor = "default";
        }
      });

    // add event listener to container for mouse click
    document.addEventListener("click", (event) => {
      // calculate normalized device coordinates (-1 to 1) for mouse2 position
      const rect = container.getBoundingClientRect();
      mouse2.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse2.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // set the cursor style to 'default' after the click
      this.$refs.container.style.cursor = "default";

      // update the raycaster with the mouse2 position
      raycaster.setFromCamera(mouse2, this.camera);

      // get the intersecting object(s)
      // const intersects = raycaster.intersectObjects([imageexitForClick]); // check for both cubes

      // // log "cube" if the first cube is clicked, or "cube2" if the second cube is clicked
      // if (intersects.length > 0) {
      //   if (
      //     intersects[0].object === imageexitForClick &&
      //     imageexitForClick.visible == true
      //   ) {
      //     imageexitForClick.visible == false;
      //     this.backtoCate();
      //   }
      // }
    });

    // render the scene
    const render = () => {
      requestAnimationFrame(render);

      const currentTime = Date.now();
      if (currentTime - lastFrameTime > frameDuration) {
        lastFrameTime = currentTime;

        // Update texture
        frameIndex = (frameIndex + 1) % textures.length;
        mesh.material.map = textures[frameIndex];
        mesh.material.needsUpdate = true;
      }


      // Smoothly move the camera along the X-axis
      this.camera.position.x += (-cameraX - this.camera.position.x) * 0.05;
      this.camera.position.z += (-cameraZ - this.camera.position.z) * 0.05;
      this.camera.position.y += (-cameraY - this.camera.position.y) * 0.1;

      if (this.moveLeft || keyboard["ArrowLeft"]) {
        cameraX += this.speedCameraX;
      }
      if (this.moveRight || keyboard["ArrowRight"]) {
        cameraX -= this.speedCameraX;
      }

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
    AnimationStart() {
      setTimeout(() => {
        gsap.to(this.$data, {
          duration: 1,
          elOpty: 1,
          ease: "power2.out",
        });
        gsap.to(this.$data, {
          duration: 1,
          hdttOpty: 1,
          ease: "power2.out",
        });

        gsap.to(".sub-sub-container-rl", {
          duration: 1,
          opacity: 1,
          ease: "power2.out",
        });
      }, 2000);
    },
    backtoCate() {
      gsap.to(this.camera.position, {
        x: 40,
        z: -7,
        duration: 2,
        ease: "elastic.out(1, 1)",
      });
      gsap.to(this.camera.position, {
        z: -9,
        delay: 1,
        duration: 2,
        ease: "elastic.out(1, 1)",
        onComplete: () => {
          this.$router.push("/Home");
        },
      });

      gsap.to(this.$data, {
        exitdoorX: 39.93,
        duration: 2,
        ease: "elastic.out(1, 1)",
      });
    },
    PlayNavi() {
      const tl = gsap.timeline({ repeat: -1 });

      tl.to(this.$data, { duration: 2, nviOpty: 1 })
        .to(this.$data, { duration: 2, nviOpty: 1 })
        .to(this.$data, { duration: 2, nviOpty: 0 })
        .to(this.$data, { duration: 1, nviOpty: 0 });
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
    font-size: 1.2vw;
    font-family:"K2D", sans-serif;
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

.image_home {
  width: 100%;
  height: 100%;
}

.effect-hot-spot .home-wrap .navHP {
  cursor: pointer;
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

.no-select {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
  outline: none;
  border: none;
}

.sub-container-rl {
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-direction: column;
}
.gesture {
  height: 100%;
  width: 100%;
}
.sub-sub-container-rl {
  bottom: 0;
  position: sticky;
  position: -webkit-sticky;

  padding-right: 2rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 10%;
  width: 100%;
  overflow: hidden;
  opacity: 0;
}
.messagebtn {
  height: auto;
  width: 40%;

  font-size: 0.9vw;
  font-family: "Prompt", sans-serif;
}
.rlbtn {
  margin-left: 3%;
  height: 100%;
  width: 12%;
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 102;

  -webkit-touch-callout: none;
  -ms-touch-action: none;
  touch-action: none;
}


.sub-rlbtn {
  position: relative;
  width: 50%;
  height: 50%;
  background-size: contain;
  background-repeat: no-repeat;
  cursor: pointer;
}
.sub-rlbtn img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: scale-down;
}

.sub-rlbtn:hover {
  -webkit-filter: invert(50%); /* Safari 6.0 - 9.0 */
  filter: invert(50%);
}
</style>