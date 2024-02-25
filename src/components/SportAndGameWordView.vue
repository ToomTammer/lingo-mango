<template>
    <div id="webglCanvas" ref="container"></div>
    <div class="effect-hot-spot">
      <div class="loading-tips"></div>
      <div class="home-wrap">
        <div class="container-rl">
          <div class="container-rl">
            <div class="sub-container-rl">
              <div class="gesture" ref="containerVI"></div>
              <!-- <div class="test-mockup">
                <div class="test-card"></div>
                <div class="test-card"></div>
                <div class="test-card"></div>
              </div> -->
              <!-- <div class="test-mockup2">
                <div class="test-card2"></div>
                <div class="test-card"></div>
              </div> -->
              <div class="label">
                <div class="txtArea">
                  <div class="txt">Player: {{playerName}}</div>
                </div>
              </div>
              <div class="sub-sub-container-rl">
                <div class="messagebtn no-select">
                  <div id="question-1" class="no-question-style" name="question"></div>
                  <div id="question-2" class="no-question-style" name="question"></div>
                  <div id="question-3" class="no-question-style" name="question"></div>
                  <div id="question-4" class="no-question-style" name="question"></div>
                  <div id="question-5" class="no-question-style" name="question"></div>
                </div>
                <!-- <div class="rlbtn">
                  <button class="next-btn"></button>
                </div> -->
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
  import { Howl } from "howler";
  // import Hammer from "hammerjs";

  import answersJson from '@/resource/answer_word.json';
  import questionJson from '@/resource/question_word.json';
  import CardSquare from '@/resource/cardSquare.json';
  import vol2 from '@/resource/vol2.json';
  // import imgBas from "@/assets/SportAndGame/word/img/bas.png";
  // import imgSoccer from "@/assets/SportAndGame/word/img/ball.png";
  // import vBas from "@/assets/SportAndGame/word/voice/which_is_soccer.mp3";

  import el2 from "@/assets/box1.png";


  export default {
    data() {
      return {
        voiceWord: null,
        containerVoiceWord: null,
        music: null,
        VoiceLoaded : false,
        isVoicePlaying : false,
        isloaded: false,
        showbtn: true,
        isVoiceQuestion: false,
        scaleOpt: 0.7,
        scaleOpt1: 0.7,
        scaleOpt2: 0.7,
        scaleOpt3: 0.7,
        containerScaleOpt : ['scaleOpt1', 'scaleOpt2', 'scaleOpt3'],
        scaleQ4: 1,
        opt1: 0,
        opt2: 0,
        opt3: 0,
        textureOpt1: 0,
        textureOpt2: 0,
        textureOpt3: 0,
        textureCardOpt1: 0,
        textureCardOpt2: 0,
        textureCardOpt3: 0,
        textureCardOpt4: 0,
        textures:[],
        texturesCardBG:[],
        options : ['opt1', 'opt2', 'opt3'],
        imgOptions : ['textureOpt1', 'textureOpt2', 'textureOpt3'],
        speedCameraX: 0.03,
        el2: el2,
        score: 0,
        question: 0,
        playerName: '',
        selectedItems:[],
        questions: questionJson.questions,
        answers: answersJson.answers,
        allPlayerData:[],
        playerData:{},

        CardSquare: CardSquare.card,
        vol2: vol2.volList,
        animateVol2:[],
        scaleVol2: 0.6,
        textureVol2: 0,


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
    async mounted() {
      localStorage.removeItem('allPlayerData');
      await this.setTextures('answers','SportAndGame/word/img/','textures');
      await this.setTextures('CardSquare','','texturesCardBG');
      await this.setTextures('vol2','','animateVol2');
      // await this.setAudio('questions','/SportAndGame/word/voice/','texturesCardBG');
      this.playerName = await localStorage.getItem('playerName') || 'unknown';
      let IsExistPlayer =  await this.checkExistPlayerData();

      if(!IsExistPlayer){
        console.log("No ExistPlayer");
        await this.selectRandomItems(this.questions, 5);
        console.log("selectedItems : ", this.selectedItems);
        await this.SetPlayerData();
        console.log("allPlayerData : ", this.allPlayerData);
        console.log("SetPlayerData : ", this.playerData);
      }else{
        console.log("ExistPlayer");
        console.log("allPlayerData : ", this.allPlayerData);
        console.log("this.playerData : ", this.playerData);
      }
      await this.manageQuestionNo();
      await this.SetRandomAns();


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

      scene.position.z = -1;

      // create the renderer
      const renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.domElement.addEventListener("webglcontextlost", function () {
        location.reload();
      });

      renderer.setSize(container.clientWidth, container.clientHeight);
      this.$refs.container.appendChild(renderer.domElement);


      //Object Start

      // Animation variables
      let frameIndex = 0;
      const frameDuration = 200; // Milliseconds per frame
      let lastFrameTime = 0;

      // Load textures
      // // const textures = [];
      // const textureLoader = new THREE.TextureLoader();
      // this.answers.forEach(url => {
      //   const texture = textureLoader.load(url.img);
      //   this.textures.push(texture);
      // });
      // Create a mesh with initial texture
      // const initialTexture = textures[0];
      const initialTexture = this.textures[this.textureOpt1];
      const initialTexture2 = this.textures[this.textureOpt2];
      const initialTexture3 = this.textures[this.textureOpt3];
      const initialTextureCardBG1 = this.texturesCardBG[this.textureCardOpt1];
      const initialTextureCardBG2 = this.texturesCardBG[this.textureCardOpt2];
      const initialTextureCardBG3 = this.texturesCardBG[this.textureCardOpt3];
      const initialTextureVol2 = this.animateVol2[this.textureVol2];

      // Vol2
      const materialVol2 = new THREE.MeshBasicMaterial({
        map: initialTextureVol2,
        side:THREE.DoubleSide,
        transparent: true,
        opacity: 1 });
      const btnVol2 = new THREE.Mesh(
        new THREE.PlaneGeometry(this.scaleVol2, this.scaleVol2),
        materialVol2);
        btnVol2.position.y = -0.5;
      scene.add(btnVol2);
      
      // CardBGOpt 1
      const materialCardBG1 = new THREE.MeshBasicMaterial({
        map: initialTextureCardBG1,
        side:THREE.DoubleSide,
        transparent: true,
        opacity: 1 });
      const CardBGOpt1 = new THREE.Mesh(
        new THREE.PlaneGeometry(this.scaleOpt1, this.scaleOpt1),
        materialCardBG1);
      CardBGOpt1.position.x = -0.76;
      scene.add(CardBGOpt1);

      // CardOpt 1
      const material1 = new THREE.MeshBasicMaterial({
        map: initialTexture,
        side:THREE.DoubleSide,
        transparent: true,
        opacity: 1 });
      const imgOpt1 = new THREE.Mesh(
        new THREE.PlaneGeometry(this.scaleOpt1, this.scaleOpt1),
        material1);
        imgOpt1.position.x = -0.76;
      scene.add(imgOpt1);

      
      // CardBGOpt 2
      const materialCardBG2 = new THREE.MeshBasicMaterial({
        map: initialTextureCardBG2,
        side:THREE.DoubleSide,
        transparent: true,
        opacity: 1 });
      const CardBGOpt2 = new THREE.Mesh(
        new THREE.PlaneGeometry(this.scaleOpt2, this.scaleOpt2),
        materialCardBG2);
      scene.add(CardBGOpt2);

      // imgOpt 2
      const material2 = new THREE.MeshBasicMaterial({
        map: initialTexture2,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1 });
      const imgOpt2 = new THREE.Mesh(
        new THREE.PlaneGeometry(this.scaleOpt2, this.scaleOpt2),
        material2);
      scene.add(imgOpt2);

      // CardBGOpt 3
      const materialCardBG3 = new THREE.MeshBasicMaterial({
        map: initialTextureCardBG3,
        side:THREE.DoubleSide,
        transparent: true,
        opacity: 1 });
      const CardBGOpt3 = new THREE.Mesh(
        new THREE.PlaneGeometry(this.scaleOpt3, this.scaleOpt3),
        materialCardBG3);
      CardBGOpt3.position.x = 0.76;
      scene.add(CardBGOpt3);

      // CardOpt 3
      const material3 = new THREE.MeshBasicMaterial({
        map: initialTexture3,
        side:THREE.DoubleSide,
        transparent: true,
        opacity: 1 });
      const imgOpt3 = new THREE.Mesh(
        new THREE.PlaneGeometry(this.scaleOpt3, this.scaleOpt3),
        material3);
      imgOpt3.position.x = 0.76;
      scene.add(imgOpt3);

      // CardBGOpt 4
      const materialCardBG4 = new THREE.MeshBasicMaterial({
        map: initialTextureCardBG1,
        side:THREE.DoubleSide,
        transparent: true,
        opacity: 0 });
      const CardBGOpt4 = new THREE.Mesh(
        new THREE.PlaneGeometry(this.scaleQ4, this.scaleQ4),
        materialCardBG4);
      CardBGOpt4.position.x = -0.8;
      scene.add(CardBGOpt4);


      //Object End

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
          const intersects = raycaster.intersectObjects([imgOpt1, imgOpt2, imgOpt3, btnVol2]); // check for both cubes
          if (intersects.length > 0) {
            if (
              intersects[0].object === imgOpt1 || intersects[0].object === imgOpt2 || intersects[0].object === imgOpt3 
              || intersects[0].object === btnVol2
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
        this.$refs.container.style.cursor = "default";

        // update the raycaster with the mouse2 position
        raycaster.setFromCamera(mouse2, this.camera);

        // get the intersecting object(s)
        const intersects = raycaster.intersectObjects([imgOpt1, imgOpt2, imgOpt3, btnVol2]); // check for both cubes

        // log "cube" if the first cube is clicked, or "cube2" if the second cube is clicked
        if (intersects.length > 0) {
          if (intersects[0].object === imgOpt1) {
            console.log("Click img Option1" , this.opt1);
            await this.nextQuestion(this.opt1);
            await this.animateAnsWrong(0);
            await this.animateChangeQuestion();
          }
          if (intersects[0].object === imgOpt2) {
            console.log("Click img Option2", this.opt2);
            await this.nextQuestion(this.opt2);
            await this.animateAnsWrong(1);
            await this.animateChangeQuestion();
          }
          if (intersects[0].object === imgOpt3) {
            console.log("Click img Option3", this.opt3);
            await this.nextQuestion(this.opt3);
            await this.animateAnsWrong(2);
            await this.animateChangeQuestion();
          }
          if (intersects[0].object === btnVol2) {
            console.log("Click img btnVol2", this.opt3);
            this.playMusic();
          }
        }
      });

      // render the scene
      const render = () => {
        requestAnimationFrame(render);

        const currentTime = Date.now();
        if (currentTime - lastFrameTime > frameDuration) {
          lastFrameTime = currentTime;

          // Update texture
          frameIndex = (frameIndex + 1) % this.textures.length;
          // cardOpt1.material.map = textures[frameIndex];
          // cardOpt1.material.needsUpdate = true;
        }

        btnVol2.material.map = this.animateVol2[this.textureVol2];
        btnVol2.material.needsUpdate = true;
        btnVol2.scale.set(this.scaleVol2, this.scaleVol2);

        imgOpt1.material.map = this.textures[this.textureOpt1];
        imgOpt1.material.needsUpdate = true;
        CardBGOpt1.material.map = this.texturesCardBG[this.textureCardOpt1];
        CardBGOpt1.material.needsUpdate = true;

        imgOpt2.material.map = this.textures[this.textureOpt2];
        imgOpt2.material.needsUpdate = true;
        CardBGOpt2.material.map = this.texturesCardBG[this.textureCardOpt2];
        CardBGOpt2.material.needsUpdate = true;

        imgOpt3.material.map = this.textures[this.textureOpt3];
        imgOpt3.material.needsUpdate = true;
        CardBGOpt3.material.map = this.texturesCardBG[this.textureCardOpt3];
        CardBGOpt3.material.needsUpdate = true;

        imgOpt1.scale.set(this.scaleOpt1, this.scaleOpt1);
        imgOpt2.scale.set(this.scaleOpt2, this.scaleOpt2);
        imgOpt3.scale.set(this.scaleOpt3, this.scaleOpt3);
        CardBGOpt1.scale.set(this.scaleOpt1, this.scaleOpt1);
        CardBGOpt2.scale.set(this.scaleOpt2, this.scaleOpt2);
        CardBGOpt3.scale.set(this.scaleOpt3, this.scaleOpt3);

        // Smoothly move the camera along the X-axis
        this.camera.position.x += (-cameraX - this.camera.position.x) * 0.05;
        this.camera.position.z += (-cameraZ - this.camera.position.z) * 0.05;
        this.camera.position.y += (-cameraY - this.camera.position.y) * 0.1;

        // if (this.moveLeft || keyboard["ArrowLeft"]) {
        //   cameraX += this.speedCameraX;
        // }
        // if (this.moveRight || keyboard["ArrowRight"]) {
        //   cameraX -= this.speedCameraX;
        // }

        // if (cameraX >= 0 || cameraX <= 0) {
        //   cameraX = 0;
        // }

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
      // non indexed BufferGeometry

      RoundedRectangle( w, h, r, s ) { // width, height, radius corner, smoothness  
        
        // helper const's
        const wi = w / 2 - r;		// inner width
        const hi = h / 2 - r;		// inner height
        const w2 = w / 2;			// half width
        const h2 = h / 2;			// half height
        const ul = r / w;			// u left
        const ur = ( w - r ) / w;	// u right
        const vl = r / h;			// v low
        const vh = ( h - r ) / h;	// v high
        
        let positions = [
        
          -wi, -h2, 0,  wi, -h2, 0,  wi, h2, 0,
          -wi, -h2, 0,  wi,  h2, 0, -wi, h2, 0,
          -w2, -hi, 0, -wi, -hi, 0, -wi, hi, 0,
          -w2, -hi, 0, -wi,  hi, 0, -w2, hi, 0,
          wi, -hi, 0,  w2, -hi, 0,  w2, hi, 0,
          wi, -hi, 0,  w2,  hi, 0,  wi, hi, 0
          
        ];
        
        let uvs = [
          
          ul,  0, ur,  0, ur,  1,
          ul,  0, ur,  1, ul,  1,
          0, vl, ul, vl, ul, vh,
          0, vl, ul, vh,  0, vh,
          ur, vl,  1, vl,  1, vh,
          ur, vl,  1, vh,	ur, vh 
          
        ];
        
        let phia = 0; 
        let phib, xc, yc, uc, vc, cosa, sina, cosb, sinb;
        
        for ( let i = 0; i < s * 4; i ++ ) {
        
          phib = Math.PI * 2 * ( i + 1 ) / ( 4 * s );
          
          cosa = Math.cos( phia );
          sina = Math.sin( phia );
          cosb = Math.cos( phib );
          sinb = Math.sin( phib );
          
          xc = i < s || i >= 3 * s ? wi : - wi;
          yc = i < 2 * s ? hi : -hi;
        
          positions.push( xc, yc, 0, xc + r * cosa, yc + r * sina, 0,  xc + r * cosb, yc + r * sinb, 0 );
          
          uc =  i < s || i >= 3 * s ? ur : ul;
          vc = i < 2 * s ? vh : vl;
          
          uvs.push( uc, vc, uc + ul * cosa, vc + vl * sina, uc + ul * cosb, vc + vl * sinb );
          
          phia = phib;
            
        }
        
        const geometry = new THREE.BufferGeometry( );
        geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array( positions ), 3 ) );
        geometry.setAttribute( 'uv', new THREE.BufferAttribute( new Float32Array( uvs ), 2 ) );
        
        return geometry;
        
      },

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

      async setAudio(data, path) {
        console.log("###setAudio");
        const GetAudio = require('@/assets/' + path + data.voice2);
        this.containerVoiceWord = GetAudio;
        console.log("Audio", GetAudio);
        this.loadMusic(this.containerVoiceWord);
      },

      loadMusic(src) {
        // If default music is already loaded, do not load it again
        if (src === this.containerVoiceWord && this.VoiceLoaded) {
          return;
        }

        if (this.voiceWord) {
          this.voiceWord.stop();
        }

        this.voiceWord = new Howl({
          src: [src],
          loop: false,
          // volume: 0.5,
        });

        // Set defaultMusicLoaded to true if loading the default music
        if (src === this.containerVoiceWord) {
          this.VoiceLoaded = true;
        }
      },

      playMusic() {
        // Change Icons
        // this.isPlaying = !this.isPlaying;
        // If music is playing, pause it
        if (this.voiceWord && this.voiceWord.playing()) {
            return;
          // this.isVoicePlaying = false;
          // this.voiceWord.pause();
        } else {
          // If music is paused or not loaded, play it
          if (this.voiceWord) {
            this.isVoicePlaying = true;
            // this.music.fade(0, 1, 2000);
            this.voiceWord.play();
          } else {
            this.loadMusic(this.containerVoiceWord);
          }
        }
      },
      
      async selectRandomItems(data, count) {
        console.log("###selectRandomItems");
        const shuffled = data.sort(() => 0.5 - Math.random());
        this.selectedItems = shuffled.slice(0, count).map(item => ({
          guid: item.guid,
          title: item.title,
          voice1: item.voice1,
          voice2: item.voice2,
          ans: item.ans
        }));
      },

      async checkExistPlayerData(){
        console.log("###checkExistPlayerData");
        this.allPlayerData = await JSON.parse(localStorage.getItem('allPlayerData')) || [];
        const currentPlayerIndex = await this.allPlayerData.findIndex(player => player.name === this.playerName);
        if (currentPlayerIndex !== -1) {
          this.playerData = this.allPlayerData[currentPlayerIndex];
          return true;
        }
        return false;
      },

      async SetPlayerData() {
        console.log("###SetPlayerData");
        this.playerData = {
          name: this.playerName,
          score: 0,
          question_no:0,
          game: this.selectedItems,
          createdAt: new Date()
        };
        this.allPlayerData.push(this.playerData);
        localStorage.setItem('allPlayerData', JSON.stringify(this.allPlayerData));
      },

      async SetRandomAns() {
        console.log("###SetRandomAns");
        const options = this.options;
        const imgOptions = this.imgOptions;

        const randomIndexForCorrect = Math.floor(Math.random() * options.length);
        const randomOptionCorrect = options[randomIndexForCorrect];
        const correctImgOpt = imgOptions[randomIndexForCorrect];
        console.log("correctImgOpt", correctImgOpt);

        
        let question_no =  this.playerData.question_no;
        this[randomOptionCorrect] = this.playerData.game[question_no].ans.score;
        console.log("question_no : ", question_no);
        let textures_no = await this.answers.findIndex(tx => tx.guid === this.playerData.game[question_no].ans.guid);
        this[correctImgOpt] = textures_no;
    
        await this.setAudio(this.playerData.game[question_no], 'SportAndGame/word/voice/');

        const answersToShuffle = this.answers.filter(answer => answer.guid != this.playerData.game[question_no].ans.guid);
        const selectedItems_other = answersToShuffle.sort(() => 0.5 - Math.random());

        for(let i = 0;  i < 3; i++) {
          if(i != randomIndexForCorrect){
            const textures_no_other = await this.answers.findIndex(tx => tx.guid === selectedItems_other[i].guid);
            const randomOption_other = imgOptions[i];
            this[randomOption_other] = textures_no_other;
            console.log(`${randomOption_other}`, textures_no_other);
          }
        }
        console.log("this.playerData.game[question_no].ans.guid : ", this.playerData.game[question_no].ans.guid);

      },

      async nextQuestion(point) {
        console.log("###nextQuestion");
        console.log("this.allPlayerData :", this.allPlayerData);
        const currentPlayerIndex = await this.allPlayerData.findIndex(player => player.name === this.playerName);
        if (currentPlayerIndex !== -1) {
          this.playerData.score += point;
          this.playerData.question_no++;
          this.allPlayerData[currentPlayerIndex] = this.playerData;
          console.log("###nextQuestion Update already");
          console.log("currentPlayer", this.allPlayerData[currentPlayerIndex]);
          localStorage.setItem('allPlayerData', JSON.stringify(this.allPlayerData));
          console.log("--------------------------------------------");
          this.manageQuestionNo();
          
        }
      },

      async manageQuestionNo() {
        console.log("###manageNoquestion");
        let question_no =  this.playerData.question_no;
        console.log("question_no :", question_no);
          var questionDivs = document.querySelectorAll(`div[id^="question-"]`);
          for (let i = 0; i < questionDivs.length; i++) {
              if (i === question_no) {
                  questionDivs[i].classList.add('no-question-active');
                  break;
              }else{
                questionDivs[i].classList.remove('no-question-active');
                questionDivs[i].classList.add('no-question-complete');
              }
          }
      },
      
      animateAnsWrong(card_no) {
        const ScaleOpt = this.containerScaleOpt;
        let cardNo =ScaleOpt[card_no];
        const tl = gsap.timeline();
        tl.to(this.$data, { duration: 0.5, [cardNo]: 0.6 })
          .to(this.$data, { duration: 0.5, [cardNo]: 0.7 });
      },

      animateChangeQuestion() {
        console.log("###animateChangeQuestion1");
        const tl = gsap.timeline();
        tl.to(this.$data, 
        { 
          delay: 1,
          duration: 0.5, 
          scaleOpt1: 0, 
          scaleOpt2: 0,
          scaleOpt3: 0 ,
          onComplete: async () => {
            await this.SetRandomAns();
          },
        })
        .to(this.$data, 
        { 
          duration: 1, 
          scaleOpt1: 0.7, 
          scaleOpt2: 0.7,
          scaleOpt3: 0.7,
          ease: "bounce.out"
        });
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
    display: flex;
    align-items: end;
    justify-content: space-between;
    height: 20%;
    width: 100%;
    overflow: hidden;
    margin-bottom: 1%;
    /* opacity: 0; */
  }
  .messagebtn {
    display: flex;
    height: 30%;
    width: 100%;
    margin-left: 5%;
    flex-direction: row;
  }
  /* .rlbtn {
    height: 100%;
    width: auto;
    pointer-events: auto;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    z-index: 102;
    margin-right: 5%;
    -webkit-touch-callout: none;
    -ms-touch-action: none;
    touch-action: none;
  } */


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

  .no-question-style{
    aspect-ratio: 1/1;
    /* flex: 0 1 5%; */
    border: 3px solid #195FCF;
    margin-right: 1%;
    border-radius: 50%;
  }
  .no-question-active{
    background-color: #FDC12E;
    border: 3px solid white;
  }

  .no-question-complete{
    background-color: #195FCF;
  }

  .test-mockup{
    padding: 0 5%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    gap: 10%;
    width: 100%;
    height: 100%;
    background-color:rgba(255, 0, 64, 0.247);
  }
  .test-card{
    width: 15%;
    aspect-ratio: 1/1;
    background-color: rgba(255, 0, 0, 0.527);
  }

  .test-mockup2{
    padding: 0 5%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    gap: 10%;
    width: 100%;
    height: 100%;
    background-color:rgba(255, 0, 64, 0.247);
  }
  .test-card2{
    width: 35%;
    aspect-ratio: 1/1;
    background-color: rgba(255, 0, 0, 0.527);
  }
  /* .next-btn{
    aspect-ratio: 1/1;
    height: 100%;
    width: 100%;
    border: none;
    background-color: orange;
    border-radius: 50%;

  } */
  </style>