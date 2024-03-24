<template>
    <div class="progress" v-if="!isloaded">
      <div class="container">
        <div class="iconLoader"></div>
      </div>
    </div>
  </template>
  
  <script>
//   import { gsap } from "gsap";
  export default {
    data: () => {
      return {
        isloaded: false,
        progress: 0,
      };
    },
    mounted() {
        window.addEventListener("load", (event) => {
      if (event.target.readyState === "complete") {
        this.isloaded = true;
        // console.log("isloaded", this.isloaded);
      }
    });
    },
  };
  </script>
  
  <style scoped>

.progress {
  position: absolute;
  /* background-image: url("@/assets/loading.png"); */
  background-color: white;
  background-repeat: repeat;
  height: 100%;
  width: 100%;
  z-index: 201;
}

  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }
  .iconLoader {
    background-image: url("@/assets/loading.gif");
    /* background-color: red; */
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    height: 30%;
    width: 20%;
  }
  .iconLoader img {
    height: 100%;
    width: 100%;
  }

  .loading-bar {
    height: 100%;
    background-color: #727167;
    transition: width 0.5s ease;
  }
  
  .messageLoader {
    margin-top: 2%;
    text-align: center;
    font-family: "Prompt", sans-serif;
    height: 10%;
    width: 60%;
    color: #504f49;
  }
  </style>
  