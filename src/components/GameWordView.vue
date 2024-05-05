<template>
  <PageLoader />
  <div v-if="showExitClicked" class="cantainer-overlay">
    <div class="container-btn">
      <div @click="exit" class="exit" draggable="false"></div>
      <div class="test-btn">Exit</div>
    </div>
    <div class="container-btn">
      <div @click="restart" class="restart" draggable="false"></div>
      <div class="test-btn">Restart</div>
    </div>
    <div class="container-btn">
      <div @click="continuebtn" class="continue" draggable="false"></div>
      <div class="test-btn">Continue</div>
    </div>
  </div>
  <div v-if="isCountdown" class="cantainer-overlay">
    <img ref="countdownImage3" class="countdown-style" src="@/assets/countdown3.png" alt="Countdown Image" draggable="false">
    <img ref="countdownImage2" class="countdown-style" src="@/assets/countdown2.png" alt="Countdown Image" draggable="false">
    <img ref="countdownImage1" class="countdown-style" src="@/assets/countdown1.png" alt="Countdown Image" draggable="false">
    <img ref="countdownImageGo" class="countdown-style" src="@/assets/countdownGo.png" alt="Countdown Image" draggable="false">
  </div>
    <div id="webglCanvas" ref="container"></div>
    <div class="effect-hot-spot">
      <div class="loading-tips"></div>
      <div class="home-wrap">
        <div class="container-rl">
          <div class="container-rl">
            <div class="sub-container-rl">
              <div class="gesture" ref="containerVI"></div>
              <div v-if="!isFinalGame" class="label">
                <div class="txtArea">
                  <div class="txt">Player: {{playerName}}</div>
                </div>
              </div>
              <div v-if="isListening" class="sub-sub-container-rl-ab">
                <div>{{transcriptTracks}}</div>
              </div>
              <div v-if="!isFinal" class="sub-sub-container-rl bottom-bar">
                <div class="messagebtn no-select">
                  <div  v-for="(item, index) in uiNoOfQ" :key="index" id="question-{{index}}" class="no-question-style" name="question"></div>
                </div>
                <div v-if="ShowBtnSkip" class="rlbtn">
                  <button @click="SkipFunc" class="next-btn">Skip</button>
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
  import { Howl } from "howler";
  import PageLoader from "@/components/PageLoader.vue";
  import answersJson from '@/resource/answer_word.json';
  import questionJson from '@/resource/question_word.json';
  import CardSquare from '@/resource/cardSquare.json';
  import vol2 from '@/resource/vol2.json';
  import mics from '@/resource/micAnimate.json';

  import el2 from "@/assets/box1.png";
  import star from "@/assets/Star.png";
  import bgStar from "@/assets/bgStar.png";
  import winnerbg from "@/assets/music/winnerBgSound.mp3";
  import reSfxCorrect from "@/assets/music/correct.mp3";
  import eSfxWrong from "@/assets/music/wrong.mp3";
  
  import MsgFinalJson from '@/resource/MsgFinal.json';


  export default {
    components: {
      PageLoader,
    },
    data() {
      return {
        isFinalGame: false,
        isExitClicked:false,
        showExitClicked:false,
        isCountdown : true,
        IsExistPlayer:false,
        lessonGuid : "",
        amountQ : 5,
        speakQNo: 3,
        isRestartNewGame : false,
        isListening : false,
        countSpeakingQ: 0,
        ShowBtnSkip: false,
        isFinal:false,
        winnerbg:winnerbg,
        musicWinner:null,
        sfxCorrect:null,
        sfxWrong:null,

        scoreForOneStar: 1,
        scoreForTwoStar: 3,
        scoreForThreeStar: 5,
        scaleStar: 0.7,
        OpacityStar: 0,
        scaleStarR: 0.6,
        OpacityStarR: 0,
        scaleStarL: 0.6,
        OpacityStarL: 0,
        OpacityngMsgFinal:0,

        allOpacityStar:0,

        MsgFinalJson: MsgFinalJson.images,
        texturesMsgFinalNo:0,
        texturesMsgFinal:[],
        scalemsg: 1,
        OpacityMsgFinal: 0,

        tracks : [],
        transcriptTracks : "...",
        audioCtx: null,
        distortion: null,
        gainNode: null,
        biquadFilter: null,
        analyser: null,
        voiceWord: null,
        containerVoiceWord: null,
        music: null,
        VoiceLoaded : false,
        isVoicePlaying : false,
        isloaded: false,
        showbtn: true,
        isVoiceQuestion: false,
        IsAble: false,
        scaleOpt: 0.8,
        scaleOpt1: 0.8,
        scaleOpt2: 0.8,
        scaleOpt3: 0.8,
        scaleimag: 0.2,
        containerScaleOpt : ['scaleOpt1', 'scaleOpt2', 'scaleOpt3'],
        opt1: 0,
        opt2: 0,
        opt3: 0,
        textureOpt1: 0,
        textureOpt2: 0,
        textureOpt3: 0,
        textureCardOpt1: 0,
        textureCardOpt2: 0,
        textureCardOpt3: 0,
        isVisibleSec1 : false,
        isVisibleSec2 : false,
        textureCardOpt4: 0,
        textureImagVol2: 0,
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
        qusetionOfEachUnit:[],
        allUnit:[],
        uiNoOfQ:[],
        questions: questionJson,
        answers: answersJson.answers,
        allPlayerData:[],
        playerData:{},
        logDataEachQuestion:[],

        CardSquare: CardSquare.card,
        vol2: vol2.volList,
        animateVol2:[],
        scaleVol2: 0.6,
        scaleVol4: 0.5,
        textureVol2: 0,

        mics: mics.micList,
        animateMics:[],
        scaleMicDefault: 0.6,
        scaleMic: 0.6,
        scaleBgMic: 0.6,
        textureMic: 0,
        texturebgMic: 3,

        hasAnimatedChangeQuestionVoice : false,

        scaleQ4: 1,
        wordCheckForQMic: [],

        allOpacity :1,
        star:star,
        bgStar:bgStar


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
      // localStorage.removeItem('allPlayerData');
      this.playerName = await JSON.parse(sessionStorage.getItem('playerName')) || 'unknown';
      this.isRestartNewGame = await JSON.parse(sessionStorage.getItem('isRestartNewGame')) || false;
      this.lessonGuid = await JSON.parse(sessionStorage.getItem('lessonGuid')) || null;
      const GetlessonIndexFromQuestions = await this.questions.findIndex(c => c.guid == this.lessonGuid);
      // console.log('this.isRestartNewGame',this.isRestartNewGame);

      ///set mic
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.distortion = this.audioCtx.createWaveShaper();
      this.gainNode = this.audioCtx.createGain();
      this.biquadFilter = this.audioCtx.createBiquadFilter();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.minDecibels = -90;
      this.analyser.maxDecibels = -10;
      this.analyser.fftSize = 256;

      // console.log("this.audioCtx", this.audioCtx);
      // console.log("this.distortion", this.distortion);
      // console.log("this.gainNode", this.gainNode);
      // console.log("this.biquadFilter", this.biquadFilter);
      // console.log("this.analyser", this.analyser);

      await this.setTextures('answers','SportAndGame/word/img/','textures');
      await this.setTextures('CardSquare','','texturesCardBG');
      await this.setTextures('vol2','','animateVol2');
      await this.setTextures('mics','','animateMics');
      await this.setTextures('MsgFinalJson','','texturesMsgFinal');
      await this.GloballoadMusic(winnerbg,'musicWinner');
      await this.GloballoadMusic(reSfxCorrect,'sfxCorrect');
      await this.GloballoadMusic(eSfxWrong,'sfxWrong');
      // await this.setAudio('questions','/SportAndGame/word/voice/','texturesCardBG');

      this.IsExistPlayer =  await this.checkExistPlayerData();
      if(!this.IsExistPlayer){
        // console.log("No ExistPlayer");
        // console.log('this.questions.question',this.questions[GetlessonIndexFromQuestions].questions);
        await this.selectRandomItems(this.questions[GetlessonIndexFromQuestions].questions, this.amountQ);
        // console.log("selectedItems : ", this.selectedItems);
        await this.SetPlayerData();
        // console.log("allPlayerData : ", this.allPlayerData);
        // console.log("SetPlayerData : ", this.playerData);
      }else{
        // console.log("ExistPlayer");
        // console.log("allPlayerData : ", this.allPlayerData);
        // console.log("this.playerData : ", this.playerData);

        const lessonIndex = await this.playerData.lesson.findIndex(c => c.guid == this.lessonGuid);
        // console.log("lessonIndex : ", lessonIndex);
        if(lessonIndex != -1){
          this.uiNoOfQ = this.playerData.lesson[lessonIndex].game;
        }

        if(this.isRestartNewGame || lessonIndex == -1){
          // console.log('this.questions.question',this.questions[GetlessonIndexFromQuestions].questions);
          await this.selectRandomItems(this.questions[GetlessonIndexFromQuestions].questions, this.amountQ);
          await this.SetPlayerData();
        }
      }
      
      await this.manageQuestionNo();
      await this.SetRandomAns();
      this.beforeStart();


      window.addEventListener("load", (event) => {
        if (event.target.readyState === "complete") {
          // console.log("load complete" );
        }
      });

      //Event
      this.emitter.on("toggleMenuForGame", (bool) => {
        this.toggleMenuForGame(bool);
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
      scene.position.y = 0.1;

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
      let frameIndexVol2 = 0;
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
      const initialTextureImagVol2 = this.textures[this.textureImagVol2];
      const initialTexturebtnMic = this.animateMics[this.textureMic];
      const initialTextureBgbtnMic = this.animateMics[this.texturebgMic];
      const initialTextureMsgFinal = this.texturesMsgFinal[this.texturesMsgFinalNo];


      // Vol2
      const materialVol2 = new THREE.MeshBasicMaterial({
        map: initialTextureVol2,
        side:THREE.DoubleSide,
        transparent: true,
        opacity: 1 });
      const btnVol2 = new THREE.Mesh(
        new THREE.PlaneGeometry(this.scaleVol2, this.scaleVol2),
        materialVol2);
        btnVol2.position.y = -0.55;
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
      CardBGOpt1.position.x = -0.9;
      scene.add(CardBGOpt1);

      // CardOpt 1
      const material1 = new THREE.MeshBasicMaterial({
        map: initialTexture,
        side:THREE.DoubleSide,
        transparent: true,
        opacity: 1 });
      const imgOpt1 = new THREE.Mesh(
        new THREE.PlaneGeometry(this.scaleOpt1 - this.scaleimag , this.scaleOpt1 - this.scaleimag),
        material1);
        imgOpt1.position.x = -0.9;
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
        new THREE.PlaneGeometry(this.scaleOpt2 - this.scaleimag, this.scaleOpt2 - this.scaleimag),
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
      CardBGOpt3.position.x = 0.9;
      scene.add(CardBGOpt3);

      // CardOpt 3
      const material3 = new THREE.MeshBasicMaterial({
        map: initialTexture3,
        side:THREE.DoubleSide,
        transparent: true,
        opacity: 1 });
      const imgOpt3 = new THREE.Mesh(
        new THREE.PlaneGeometry(this.scaleOpt3 - this.scaleimag, this.scaleOpt3 - this.scaleimag),
        material3);
      imgOpt3.position.x = 0.9;
      scene.add(imgOpt3);

      // CardBGOpt 4
      const materialCardBG4 = new THREE.MeshBasicMaterial({
        map: initialTextureCardBG1,
        side:THREE.DoubleSide,
        transparent: true,
        opacity: 1 });
      const CardBGOpt4 = new THREE.Mesh(
        new THREE.PlaneGeometry(this.scaleQ4, this.scaleQ4),
        materialCardBG4);
      CardBGOpt4.position.x = -0.5;
      CardBGOpt4.position.y = -0.15;
      scene.add(CardBGOpt4);

      // CardBGOpt 5
      const materialCardImag4 = new THREE.MeshBasicMaterial({
        map: initialTextureImagVol2,
        side:THREE.DoubleSide,
        transparent: true,
        opacity: 1 });
      const CardBGImag4  = new THREE.Mesh(
        new THREE.PlaneGeometry(this.scaleQ4 - 0.1, this.scaleQ4 - 0.1),
        materialCardImag4);
      CardBGImag4.position.x = -0.5;
      CardBGImag4.position.y = -0.15;
      scene.add(CardBGImag4);

      // Vol4
      const materialVol4 = new THREE.MeshBasicMaterial({
        map: initialTextureVol2,
        side:THREE.DoubleSide,
        transparent: true,
        opacity: 1 });
      const btnVol4 = new THREE.Mesh(
        new THREE.PlaneGeometry(this.scaleVol4, this.scaleVol4),
        materialVol4);
        btnVol4.position.y = -0.65;
        btnVol4.position.x = -0.5;
      scene.add(btnVol4);

      // BGbtnMic
      const materialBgMic = new THREE.MeshBasicMaterial({
        map: initialTextureBgbtnMic,
        side:THREE.DoubleSide,
        transparent: true,
        opacity: 1 });
      const bgBtnMic = new THREE.Mesh(
        new THREE.PlaneGeometry(this.scaleMic, this.scaleMic),
        materialBgMic);
        bgBtnMic.position.x = 0.5;
        bgBtnMic.position.y = -0.15;
      scene.add(bgBtnMic);

      // btnMic
      const materialMic = new THREE.MeshBasicMaterial({
        map: initialTexturebtnMic,
        side:THREE.DoubleSide,
        transparent: true,
        opacity: 1 });
      const btnMic = new THREE.Mesh(
        new THREE.PlaneGeometry(this.scaleMic, this.scaleMic),
        materialMic);
        btnMic.position.x = 0.5;
        btnMic.position.y = -0.15;
      scene.add(btnMic);

      // BgOFStar
      const geometry = new THREE.PlaneGeometry(5, 6);
      const material = new THREE.MeshBasicMaterial({
          color: 0x000000, 
          opacity: 0,
          transparent: true
      });

      const BgOFStar = new THREE.Mesh(geometry, material);

      scene.add(BgOFStar);


      // BgStar
      const textureBgStar = new THREE.TextureLoader().load(this.bgStar);
      const materialBgStar = new THREE.MeshBasicMaterial({
        map: textureBgStar,
        side:THREE.DoubleSide,
        transparent: true,
        opacity: this.OpacityStar });
      const BgStar = new THREE.Mesh(
        new THREE.PlaneGeometry(this.scaleStar, this.scaleStar),
        materialBgStar);
        // BgStar.position.x = 0.5;
        BgStar.position.y = 0.1;
      scene.add(BgStar);

      // Star
      const textureStar = new THREE.TextureLoader().load(this.star);
      const materialStar = new THREE.MeshBasicMaterial({
        map: textureStar,
        side:THREE.DoubleSide,
        transparent: true,
        opacity: this.OpacityStar });
      const Star = new THREE.Mesh(
        new THREE.PlaneGeometry(this.scaleStar, this.scaleStar),
        materialStar);
        // Star.position.x = 0.5;
        Star.position.y = 0.1;
      scene.add(Star);

      // BgStarR
      const textureBgStarR = new THREE.TextureLoader().load(this.bgStar);
      const materialBgStarR = new THREE.MeshBasicMaterial({
        map: textureBgStarR,
        side:THREE.DoubleSide,
        transparent: true,
        opacity: this.OpacityStarR });
      const BgStarR = new THREE.Mesh(
        new THREE.PlaneGeometry(this.scaleStarR, this.scaleStarR),
        materialBgStarR);
        BgStarR.position.x = 0.39;
        BgStarR.position.y = -0.1;
        BgStarR.rotation.z = -0.4;
      scene.add(BgStarR);

      // StarR
      const textureStarR = new THREE.TextureLoader().load(this.star);
      const materialStarR = new THREE.MeshBasicMaterial({
        map: textureStarR,
        side:THREE.DoubleSide,
        transparent: true,
        opacity: this.OpacityStarR });
      const StarR = new THREE.Mesh(
        new THREE.PlaneGeometry(this.scaleStarR, this.scaleStarR),
        materialStarR);
        StarR.position.x = 0.39;
        StarR.position.y = -0.1;
        StarR.rotation.z = -0.4;
        // StarR.rotation.y = 0.5;
        // StarR.position.y = 0.1;
      scene.add(StarR);


      // BgStarL
      const textureBgStarL = new THREE.TextureLoader().load(this.bgStar);
      const materialBgStarL = new THREE.MeshBasicMaterial({
        map: textureBgStarL,
        side:THREE.DoubleSide,
        transparent: true,
        opacity: this.OpacityStarL });
      const BgStarL = new THREE.Mesh(
        new THREE.PlaneGeometry(this.scaleStarL, this.scaleStarL),
        materialBgStarL);
        BgStarL.position.x = -0.39;
        BgStarL.position.y = -0.1;
        BgStarL.rotation.z = 0.4;
      scene.add(BgStarL);

      // StarL
      const textureStarL = new THREE.TextureLoader().load(this.star);
      const materialStarL = new THREE.MeshBasicMaterial({
        map: textureStarL,
        side:THREE.DoubleSide,
        transparent: true,
        opacity: this.OpacityStarL });
      const StarL = new THREE.Mesh(
        new THREE.PlaneGeometry(this.scaleStarL, this.scaleStarL),
        materialStarL);
        StarL.position.x = -0.39;
        StarL.position.y = -0.1;
        StarL.rotation.z = 0.4;
        // StarL.rotation.y = 0.5;
        // StarL.position.y = 0.1;
      scene.add(StarL);

      // msgFinal
      const materialmsgFinal = new THREE.MeshBasicMaterial({
        map: initialTextureMsgFinal,
        side:THREE.DoubleSide,
        transparent: true,
        opacity: 1 });
      const msgFinal = new THREE.Mesh(
        new THREE.PlaneGeometry(this.scalemsg, this.scalemsg),
        materialmsgFinal);
        msgFinal.position.y = -0.3;
        // msgFinal.rotation.y = 0.5;
        // msgFinal.position.y = 0.1;
      scene.add(msgFinal);





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
          const intersects = raycaster.intersectObjects([CardBGOpt1, CardBGOpt2, CardBGOpt3, btnVol2, btnMic, btnVol4]); // check for both cubes
          if (intersects.length > 0) {
            if (
              (intersects[0].object === CardBGOpt1 || intersects[0].object === CardBGOpt2 || intersects[0].object === CardBGOpt3
              || intersects[0].object == btnVol2 || (intersects[0].object === btnMic && this.isVisibleSec2) || (intersects[0].object === btnVol4 && this.isVisibleSec2)
                )&& this.IsAble && !this.isExitClicked) {
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
        const intersects = raycaster.intersectObjects([CardBGOpt1, CardBGOpt2, CardBGOpt3, btnVol2, btnMic, btnVol4]); // check for both cubes

        // log "cube" if the first cube is clicked, or "cube2" if the second cube is clicked
        if (intersects.length > 0) {
          if (intersects[0].object === CardBGOpt1 && this.IsAble && !this.isExitClicked) {
            await this.nextQuestion(this.opt1);
            await this.animateAns(0);
            await this.animateChangeQuestion();
          }
          if (intersects[0].object === CardBGOpt2 && this.IsAble && !this.isExitClicked) {
            await this.nextQuestion(this.opt2);
            await this.animateAns(1);
            await this.animateChangeQuestion();
          }
          if (intersects[0].object === CardBGOpt3 && this.IsAble && !this.isExitClicked) {
            // console.log("Click img Option3", this.opt3);
            await this.nextQuestion(this.opt3);
            await this.animateAns(2);
            await this.animateChangeQuestion();
          }
          if (intersects[0].object === btnVol2 && this.IsAble && !this.isExitClicked) {
            this.playMusic();
          }
          if (intersects[0].object === btnVol4 && this.IsAble && !this.isExitClicked && this.isVisibleSec2) {
            this.playMusic();
          }
          if (intersects[0].object === btnMic && this.IsAble && this.isVisibleSec2 && !this.isExitClicked) {
            this.SpeechRecognition();
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
          this.scaleBgMic = level/150;
          // console.log('this.scaleBgMic', this.scaleBgMic);
          if(this.scaleBgMic >= 1.3){
            this.scaleBgMic = 1.3;
          }
          // if(this.scaleBgMic <= 0.6){
          //   this.scaleBgMic = 0.6;
          // }
        }

        const currentTime = Date.now();
        if (currentTime - lastFrameTime > frameDuration) {
          lastFrameTime = currentTime;

          // Update texture
          frameIndex = (frameIndex + 1) % this.textures.length;
          frameIndexVol2 = (frameIndex + 1) % this.animateVol2.length;
          if(this.voiceWord != null && this.voiceWord.playing()){

            btnVol2.material.map = this.animateVol2[frameIndexVol2];
            btnVol2.material.needsUpdate = true;
            btnVol4.material.map = this.animateVol2[frameIndexVol2];
            btnVol4.material.needsUpdate = true;
          }else{
            btnVol2.material.map = this.animateVol2[this.textureVol2];
            btnVol2.material.needsUpdate = true;
            btnVol4.material.map = this.animateVol2[this.textureVol2];
            btnVol4.material.needsUpdate = true;
          }
          // cardOpt1.material.map = textures[frameIndex];
          // cardOpt1.material.needsUpdate = true;
        }


        btnVol2.scale.set(this.scaleVol2, this.scaleVol2);
        btnVol2.visible = this.isVisibleSec1;
        btnVol2.material.opacity = this.allOpacity;

        imgOpt1.material.map = this.textures[this.textureOpt1];
        imgOpt1.material.needsUpdate = true;
        imgOpt1.scale.set(this.scaleOpt1, this.scaleOpt1);
        imgOpt1.visible = this.isVisibleSec1;
        imgOpt1.material.opacity = this.allOpacity;
        CardBGOpt1.material.map = this.texturesCardBG[this.textureCardOpt1];
        CardBGOpt1.material.needsUpdate = true;
        CardBGOpt1.scale.set(this.scaleOpt1, this.scaleOpt1);
        CardBGOpt1.visible = this.isVisibleSec1;
        CardBGOpt1.material.opacity = this.allOpacity;

        imgOpt2.material.map = this.textures[this.textureOpt2];
        imgOpt2.material.needsUpdate = true;
        imgOpt2.scale.set(this.scaleOpt2, this.scaleOpt2);
        imgOpt2.visible = this.isVisibleSec1;
        imgOpt2.material.opacity = this.allOpacity;
        CardBGOpt2.material.map = this.texturesCardBG[this.textureCardOpt2];
        CardBGOpt2.material.needsUpdate = true;
        CardBGOpt2.scale.set(this.scaleOpt2, this.scaleOpt2);
        CardBGOpt2.visible = this.isVisibleSec1;
        CardBGOpt2.material.opacity = this.allOpacity;

        imgOpt3.material.map = this.textures[this.textureOpt3];
        imgOpt3.material.needsUpdate = true;
        imgOpt3.scale.set(this.scaleOpt3, this.scaleOpt3);
        imgOpt3.visible = this.isVisibleSec1;
        imgOpt3.material.opacity = this.allOpacity;
        CardBGOpt3.material.map = this.texturesCardBG[this.textureCardOpt3];
        CardBGOpt3.material.needsUpdate = true;
        CardBGOpt3.scale.set(this.scaleOpt3, this.scaleOpt3);
        CardBGOpt3.visible = this.isVisibleSec1;
        CardBGOpt3.material.opacity = this.allOpacity;


        CardBGOpt4.material.map = this.texturesCardBG[this.textureCardOpt3];
        CardBGOpt4.material.needsUpdate = true;
        CardBGOpt4.scale.set(this.scaleQ4, this.scaleQ4);
        CardBGOpt4.visible = this.isVisibleSec2;
        CardBGOpt4.material.opacity = this.allOpacity;
        // CardBGOpt4.material.opacity = this.scaleQ4Opacity;

        CardBGImag4.material.map = this.textures[this.textureImagVol2];
        CardBGImag4.material.needsUpdate = true;
        CardBGImag4.scale.set(this.scaleQ4, this.scaleQ4);
        CardBGImag4.visible = this.isVisibleSec2;
        CardBGImag4.material.opacity = this.allOpacity;

        btnMic.material.map = this.animateMics[this.textureMic];
        btnMic.material.needsUpdate = true;
        btnMic.scale.set(this.scaleMic, this.scaleMic);
        btnMic.visible = this.isVisibleSec2;
        btnMic.material.opacity = this.allOpacity;

        bgBtnMic.material.map = this.animateMics[this.texturebgMic];
        bgBtnMic.material.needsUpdate = true;
        bgBtnMic.scale.set(this.scaleBgMic, this.scaleBgMic);
        bgBtnMic.visible = this.isVisibleSec2;
        bgBtnMic.material.opacity = this.allOpacity;

        BgStar.scale.set(this.scaleStar, this.scaleStar);
        BgStar.visible = true;
        BgStar.material.opacity = this.allOpacityStar;

        Star.scale.set(this.scaleStar, this.scaleStar);
        Star.visible = true;
        Star.material.opacity = this.OpacityStar;

        BgStarR.scale.set(this.scaleStarR, this.scaleStarR);
        BgStarR.visible = true;
        BgStarR.material.opacity = this.allOpacityStar;

        StarR.scale.set(this.scaleStarR, this.scaleStarR);
        StarR.visible = true;
        StarR.material.opacity = this.OpacityStarR;

        BgStarL.scale.set(this.scaleStarL, this.scaleStarL);
        BgStarL.visible = true;
        BgStarL.material.opacity = this.allOpacityStar;

        StarL.scale.set(this.scaleStarL, this.scaleStarL);
        StarL.visible = true;
        StarL.material.opacity = this.OpacityStarL;

        msgFinal.material.map = this.texturesMsgFinal[this.texturesMsgFinalNo];
        msgFinal.material.needsUpdate = true;
        msgFinal.scale.set(this.scalemsg, this.scalemsg);
        msgFinal.visible = true;
        msgFinal.material.opacity = this.OpacityMsgFinal;

        BgOFStar.material.opacity = this.OpacityngMsgFinal;

        btnVol4.scale.set(this.scaleVol4, this.scaleVol4);
        btnVol4.visible = this.isVisibleSec2;
        btnVol4.material.opacity = this.allOpacity;

        // Smoothly move the camera along the X-axis
        this.camera.position.x += (-cameraX - this.camera.position.x) * 0.05;
        this.camera.position.z += (-cameraZ - this.camera.position.z) * 0.05;
        this.camera.position.y += (-cameraY - this.camera.position.y) * 0.1;

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

      stopBGMusic(bool) {
      this.emitter.emit("stopBGMusic", bool);
      },

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

      async setAudio(data, path, val) {
        // console.log("###setAudio");
        const GetAudio = require('@/assets/' + path + data[val]);
        this.containerVoiceWord = GetAudio;
        // console.log("Audio", GetAudio);
        await this.loadMusic(this.containerVoiceWord);
      },

      GloballoadMusic(src, container) {
        if (this[container]) {
          this[src].stop();
        }
        this[container] = new Howl({
          src: [src],
          loop: false,
        });

      },

      GlobalplayMusic(src, name) {
        if(!this.isListening){
          if (this[name] && this[name].playing()) {
            this[name].stop();
            return;
          } else {
            if (this[name]) {
              this[name].play();
            } else {
              this.GloballoadMusic(src,name);
            }
          }
        }
      },


      loadMusic(src) {
        // If default music is already loaded, do not load it again
        // console.log("###loadMusic");
        if (src === this.containerVoiceWord && this.VoiceLoaded) {
          return;
        }

        if (this.voiceWord) {
          this.voiceWord.stop();
        }
        // console.log("this.voiceWord", this.voiceWord);

        this.voiceWord = new Howl({
          src: [src],
          loop: false,
          // autoplay: true,
          // volume: 0.5,
        });
        // console.log("this.voiceWord", this.voiceWord);

        // Set defaultMusicLoaded to true if loading the default music
        if (src === this.containerVoiceWord) {
          this.VoiceLoaded = true;
        }
      },

      playMusic() {
        // console.log("###playMusic");
        // console.log("###this.isListening", this.isListening);
        // Change Icons
        // this.isPlaying = !this.isPlaying;
        // If music is playing, pause it
        if(!this.isListening){
          if (this.voiceWord && this.voiceWord.playing()) {
            this.isVoicePlaying = false;
            this.voiceWord.stop();
            return;
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
        }
       
      },

      async selectRandomItems(data, count) {
        // console.log("###selectRandomItems");
        const shuffled = data.sort(() => 0.5 - Math.random());
        this.selectedItems = shuffled.slice(0, count).map(item => ({
          guid: item.guid,
          title: item.title,
          voice1: item.voice1,
          voice2: item.voice2,
          ans: item.ans
        }));
        
        const lessonIndex = await this.playerData.lesson.findIndex(c => c.guid == this.lessonGuid);
        if(this.isRestartNewGame && this.IsExistPlayer && lessonIndex != -1){
          // console.log('this.isRestartNewGame && this.IsExistPlayer',this.isRestartNewGame && this.IsExistPlayer);
          this.playerData.lesson[lessonIndex].game = this.selectedItems;
          this.playerData.lesson[lessonIndex].score = 0;
          this.playerData.lesson[lessonIndex].question_no = 0;
        }else{
            this.qusetionOfEachUnit = {
            guid: this.lessonGuid,
            title : this.questions.title,
            score: 0,
            question_no:0,
            game : [],
            log : [],
            alllog : []
          }

          this.qusetionOfEachUnit.game = this.selectedItems;
          this.allUnit.push(this.qusetionOfEachUnit);
        }

      },

      async checkExistPlayerData(){
        // console.log("###checkExistPlayerData");
        this.allPlayerData = await JSON.parse(localStorage.getItem('allPlayerData')) || [];
        const currentPlayerIndex = await this.allPlayerData.findIndex(player => player.name === this.playerName);
        // console.log("###currentPlayerIndex", currentPlayerIndex);
        if (currentPlayerIndex !== -1) {
          this.playerData = this.allPlayerData[currentPlayerIndex];
          this.allUnit = this.playerData.lesson;
          return true;
        }
        return false;
      },

      async SetPlayerData() {
        // console.log("###SetPlayerData");
        if(this.isRestartNewGame && this.IsExistPlayer){
          const currentPlayerIndex = await this.allPlayerData.findIndex(player => player.name === this.playerName);
          this.allPlayerData[currentPlayerIndex] = this.playerData;
            
        }else{
          this.playerData = {
            name: this.playerName,
            lesson: this.allUnit,
            createdAt: new Date()
          };
          this.allPlayerData.push(this.playerData);
        }
        localStorage.setItem('allPlayerData', JSON.stringify(this.allPlayerData));
      },

      async SetRandomAns() {
        const options = this.options;
        const imgOptions = this.imgOptions;
    
        const randomIndexForCorrect = Math.floor(Math.random() * options.length);
        const randomOptionCorrect = options[randomIndexForCorrect];
        const correctImgOpt = imgOptions[randomIndexForCorrect];
        ///set ans score are 0
        await this.setOptionSocre(randomIndexForCorrect);
        
        const lessonIndex = await this.playerData.lesson.findIndex(c => c.guid == this.lessonGuid);
        let question_no =  this.playerData.lesson[lessonIndex].question_no;
          

          if(question_no != this.amountQ ){
            
            this[randomOptionCorrect] = await this.playerData.lesson[lessonIndex].game[question_no].ans.score;
          
            let textures_no = await this.answers.findIndex(tx => tx.guid === this.playerData.lesson[lessonIndex].game[question_no].ans.guid);
            let audio_no = question_no < this.speakQNo ? 1 : 2;
            this.VoiceLoaded = false;
            await this.setAudio(this.playerData.lesson[lessonIndex].game[question_no], 'SportAndGame/', `voice${audio_no}`);

            if(question_no < this.speakQNo ){
            this[correctImgOpt] = textures_no;
            const answersToShuffle = this.answers.filter(answer => answer.guid != this.playerData.lesson[lessonIndex].game[question_no].ans.guid);
            const selectedItems_other = answersToShuffle.sort(() => 0.5 - Math.random());

            for(let i = 0;  i < 3; i++) {
              if(i != randomIndexForCorrect){
                const textures_no_other = await this.answers.findIndex(tx => tx.guid === selectedItems_other[i].guid);
                const randomOption_other = imgOptions[i];
                this[randomOption_other] = textures_no_other;
                // console.log(`${randomOption_other}`, textures_no_other);
              }
            }
            }else{
            this.textureImagVol2 = textures_no;
            this.wordCheckForQMic = this.playerData.lesson[lessonIndex].game[question_no].title;
            // console.log('this.wordCheckForQMic ', this.wordCheckForQMic );
            }
          }
          
          if(!this.hasAnimatedChangeQuestion && !this.isCountdown){
            this.animateChangeQuestion();
            this.hasAnimatedChangeQuestion = true;
          }
        // if(this.playerData.lesson[lessonIndex].question_no == this.speakQNo && this.playerData.lesson[lessonIndex].question_no < this.amountQ && !this.hasAnimatedChangeQuestion){
        //   this.isVisibleSec2 = true;
        //   this.animateChangeQuestionVoice();
        //   this.hasAnimatedChangeQuestion = true;
        // }else if(!this.hasAnimatedChangeQuestion){
        //   this.animateChangeQuestionOpt();
        //   this.hasAnimatedChangeQuestion = true;
        // }

      },

      setOptionSocre(randomIndexForCorrect)
      {
        const options = this.options;
        for(let i = 0;  i < options.length; i++) {
          if(i != randomIndexForCorrect){
            this[options[i]] = 0
          }
        }

        return true;
      },

      async nextQuestion(point) {
        if(point == 1){
          this.sfxCorrect.play();
        }else{
          this.sfxWrong.play();
        }
        // console.log("###nextQuestion");
        this.IsAble = false;
        // console.log("this.allPlayerData :", this.allPlayerData);
        const currentPlayerIndex = await this.allPlayerData.findIndex(player => player.name === this.playerName);
        if (currentPlayerIndex !== -1) {
          const lessonIndex = await this.playerData.lesson.findIndex(c => c.guid == this.lessonGuid);
          this.playerData.lesson[lessonIndex].score += point;

          let question_no =  this.playerData.lesson[lessonIndex].question_no;
          if(question_no != this.amountQ){
            let logData = {
              question : this.playerData.lesson[lessonIndex].game[question_no].title,
              type: question_no < this.speakQNo ? "Multiple-choice" : "Speaking",
              socre : point,
            }
            // console.log('logData',logData);
            let allLogData;

            this.logDataEachQuestion.push(logData);
            allLogData = {
              playAt : new Date(),
              data : this.logDataEachQuestion
            }
            this.playerData.lesson[lessonIndex].question_no++;
            this.playerData.lesson[lessonIndex].log = allLogData;
            this.allPlayerData[currentPlayerIndex] = this.playerData;
          }
           
          
          // console.log("###nextQuestion Update already");
          // console.log("currentPlayer", this.allPlayerData[currentPlayerIndex]);
          localStorage.setItem('allPlayerData', JSON.stringify(this.allPlayerData));
          // console.log("--------------------------------------------");
          let allGame = this.playerData.lesson[lessonIndex].game
          // console.log(allGame.length);
          if(question_no <= allGame.length){
            this.manageQuestionNo();
          }else{
            // console.log("Finnaly");
          }

        }
      },

      async manageQuestionNo() {
        // console.log("###manageNoquestion");
        const lessonIndex = await this.playerData.lesson.findIndex(c => c.guid == this.lessonGuid);
        let question_no =  this.playerData.lesson[lessonIndex].question_no;
        // console.log("question_no :", question_no);
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

      animateAns(card_no) {
        const ScaleOpt = this.containerScaleOpt;
        let cardNo =ScaleOpt[card_no];
        const tl = gsap.timeline();
        tl.to(this.$data, { duration: 0.2, [cardNo]: 0.6 })
          .to(this.$data, { duration: 0.2, [cardNo]: 0.8 });
      },

      async animateChangeQuestion() {
        // console.log("###animateChangeQuestion1");
        const lessonIndex = await this.playerData.lesson.findIndex(c => c.guid == this.lessonGuid);
        if(this.playerData.lesson[lessonIndex].question_no < this.speakQNo){
          this.animateChangeQuestionOpt();
        }else{
          this.isVisibleSec2 = true;
          this.animateChangeQuestionVoice();
        }
      },

      animateChangeQuestionOpt(){
        const tl = gsap.timeline();
        tl.to(this.$data,
        {
          delay: 0.4,
          duration: 0.2,
          scaleOpt1: 0,
          scaleOpt2: 0,
          scaleOpt3: 0,
          onComplete: async () => {
            this.isVisibleSec1 = true;
            if(this.voiceWord != null){
              this.voiceWord.stop();
            }
            if(this.sfxCorrect != null){
              this.sfxCorrect.stop();
            }
            if(this.sfxWrong != null){
              this.sfxWrong.stop();
            }

            await this.SetRandomAns();
            const lessonIndex = await this.playerData.lesson.findIndex(c => c.guid == this.lessonGuid);
            let question_no =  this.playerData.lesson[lessonIndex].question_no;
            if(question_no != this.amountQ){
              this.animateChangeQuestionOpt2();
            }else{
              this.isVisibleSec1 = false;
              this.animateFinalFirst();
              // console.log("Finnal");
            }
          },
        });
      },

      animateChangeQuestionOpt2(){
        const tl = gsap.timeline();
        tl.to(this.$data,
        {
          duration: 0.5,
          scaleOpt1: 0.8,
          scaleOpt2: 0.8,
          scaleOpt3: 0.8,
          ease: "bounce.out",
          onComplete: async () => {
            await this.playMusic();
            this.IsAble = true;
          },
        });
      },

      animateChangeQuestionVoice() {
        // console.log("###animateChangeQuestion1");
        const tl = gsap.timeline();
        tl.to(this.$data,
        {
          delay: 0.5,
          duration: 0.2,
          scaleOpt1: 0,
          scaleOpt2: 0,
          scaleOpt3: 0,
          scaleVol2: 0,
          onComplete: async () => {
            this.isVisibleSec1 = false;
            if(this.voiceWord != null){
              this.voiceWord.stop();
            }
            if(this.sfxCorrect != null){
              this.sfxCorrect.stop();
            }
            if(this.sfxWrong != null){
              this.sfxWrong.stop();
            }
            await this.SetRandomAns();
          },
        })
        .from(this.$data,
        {
          duration: 0.5,
          scaleQ4: 0,
          scaleMic: 0,
          scaleBgMic: 0,
          scaleVol4: 0,
          ease: "bounce.out",
          onComplete: async () => {
            await this.playMusic();
            this.IsAble = true;
            this.isVisibleSec2 = true
          },
        });
      },
      animateChangeQuestionVoice2() {
        // console.log("###animateChangeQuestion2");
        const tl = gsap.timeline();
        tl.to(this.$data,
        {
          duration: 0.2,
          scaleQ4: 0,
          scaleMic: 0,
          scaleBgMic: 0,
          scaleVol4: 0,
          onComplete: async () => {
            this.IsAble = false;
            if(this.voiceWord != null){
              this.voiceWord.stop();
            }
            if(this.sfxCorrect != null){
              this.sfxCorrect.stop();
            }
            if(this.sfxWrong != null){
              this.sfxWrong.stop();
            }
            await this.SetRandomAns();
            const lessonIndex = await this.playerData.lesson.findIndex(c => c.guid == this.lessonGuid);
            let question_no =  this.playerData.lesson[lessonIndex].question_no;
            if(question_no != this.amountQ){
              this.animateChangeQuestionVoice3();
            }else{
              this.isVisibleSec2 = false;
              this.animateFinalFirst();
              // console.log("Finnal");
            }
          },
        });

      },

      animateChangeQuestionVoice3(){
        const tl = gsap.timeline();
        tl.to(this.$data,
        {
          duration: 0.5,
          scaleQ4: 1,
          scaleMic: 0.6,
          scaleBgMic: 0.6,
          scaleVol4: 0.5,
          ease: "bounce.out",
          onComplete: async () => {
            await this.playMusic();
            this.IsAble = true;
            this.isVisibleSec2 = true;
          },
        });
      },

      async animateFinalFirst() {
        this.SentFinal(true);
        this.GlobalplayMusic(winnerbg,'musicWinner');
        if (this.musicWinner) {
            await this.musicWinner.play();
          }
        
        this.isFinal = true
        // await this.seveData();
        // console.log("###animateFinalFirst");
        const lessonIndex = await this.playerData.lesson.findIndex(c => c.guid == this.lessonGuid);
        let score =  this.playerData.lesson[lessonIndex].score;
        let one = 0;
        let two = 0;
        let three = 0;

        if (score >= this.scoreForThreeStar) {
          one = two = three = 1;
          this.texturesMsgFinalNo = 2;
        } else if (score >= this.scoreForTwoStar) {
          one = two = 1;
          this.texturesMsgFinalNo = 1;
        } else if (score > this.scoreForOneStar) {
          one = 1;
          this.texturesMsgFinalNo = 0;
        }

        const tl = gsap.timeline();
        const tl2 = gsap.timeline();
        tl.to(this.$data,
        {
          duration: 0.2,
          OpacityngMsgFinal: 0.8,
        }).to(this.$data,
        {
          duration: 0.2,
          allOpacityStar: 1,
          scaleStarL: 0.7,
          OpacityStarL: one,
          ease: "back.out(1.7)",
        }).to(this.$data,
        {
          duration: 0.2,
          scaleStar: 0.8,
          OpacityStar: two,
          ease: "back.out(1.7)",
        }).to(this.$data,
        {
          duration: 0.5,
          scaleStarR: 0.7,
          OpacityStarR: three,
          ease: "back.out(1.7)",
        });
        tl2.to(this.$data,
        {
          duration: 1,
          scalemsg: 1.3,
          OpacityMsgFinal: 1,
          ease: "back.out(1.7)",
          onComplete: async () => {
            setTimeout(()=>{
              this.backToCate();
            }, 7000);
          },
        });
      },

      SentFinal(bool) {
        this.isFinalGame = bool;
      this.emitter.emit("SentFinal", bool);
      },

      async SpeechRecognition(){
        this.voiceWord.stop();
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert("Your browser does not support microphone access. Please try a different browser.");
            return false;
        }
        let timeoutId; // Variable to hold timeout ID
        let words= null;
        let transcript ="";
        const stopRecognition = () => {
            this.textureMic = 0;
            const tl = gsap.timeline();
            this.stopBGMusic(false);
            tl.to(this.$data,
            {
              duration: 1,
              scaleBgMic: this.scaleMicDefault,
            })
            this.tracks.forEach((track) => {
              track.stop();
            });
            if (this.recognition) {
                this.recognition.stop(); // Stop speech recognition if it's running
                this.isListening = false;
            }
            clearTimeout(timeoutId); // Clear the timeout
        };

        if (!this.isListening) {
          this.stopBGMusic(true);
          this.textureMic = 1;
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.isListening = true;

            this.tracks = stream.getTracks();
            const source = this.audioCtx.createMediaStreamSource(stream);
            source.connect(this.distortion);
            this.distortion.connect(this.biquadFilter);
            this.biquadFilter.connect(this.gainNode);
            this.gainNode.connect(this.analyser);
            // this.analyser.connect(this.audioCtx.destination);

            let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                // console.log("SpeechRecognition is not supported in this browser.");
                return;
            }


            const recognition = new SpeechRecognition(); // Create a new SpeechRecognition object
            recognition.lang = 'en-US'; // Set language to English
            recognition.continuous = true; // Continuously recognize speech
            recognition.interimResults = false; // Get final results only
            // Set maximum length of recognized phrase
            const MAX_PHRASE_LENGTH = 10; // for example, allow phrases up to 5 words
            recognition.onresult = async (event) => { // Event handler when speech is recognized
                // this.transcriptTracks = 
                transcript += event.results[event.results.length - 1][0].transcript.toLowerCase(); // Get the transcript and convert to lowercase
                words = transcript.split(' '); // Split transcript into words
                // console.log('Transcript:', transcript);
                // console.log('words:', words);
                if (words.length >= MAX_PHRASE_LENGTH) {
                    // console.log('Phrase is too long. Ignoring.');
                }
                // if (this.wordCheckForQMic.some(word => transcript.includes(word))) {
                //     stopRecognition();
                //     await this.nextQuestion(1);
                //     await this.animateChangeQuestionVoice2();
                // }else{
                //   this.countForSkip();
                // } 
            };
            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.ShowBtnSkip = true;
                stopRecognition(); // Stop recognition on error
            };
            recognition.onend = async () => {
                // console.log('Speech recognition ended.');
                this.transcriptTracks = "...";
                if (this.wordCheckForQMic.some(word => transcript.includes(word))) {
                    stopRecognition();
                    await this.nextQuestion(1);
                    await this.animateChangeQuestionVoice2();
                }else{
                  this.sfxWrong.play();
                  this.countForSkip();
                } 
                stopRecognition(); // Stop recognition when it naturally ends
              };

            recognition.start(); // Start speech recognition
            this.recognition = recognition; // Save the recognition object for later use

            // Set timeout for silence
            timeoutId = setTimeout(() => {
                // console.log('No speech detected. 10 seconds.');
                stopRecognition()
            }, 60000); // 60 seconds

          } catch (err) {
            // console.log('The following gUM error occured: ' + err);
          }
        } else {
          stopRecognition(); // Stop recognition if already listening
        }
      },

      countForSkip(){
        this.countSpeakingQ += 1;
        if(this.countSpeakingQ >= 3){
          this.ShowBtnSkip = true;
        }
      },

      backToHome() {
        this.$router.push("/Home");
      },

      backToCate() {
        this.$router.push("/Category");
      },

      beforeStart(){
        window.addEventListener("load", (event) => {
        if (event.target.readyState === "complete") {
          if(this.playerName == 'unknown'){
            this.backToHome();
          }
          setTimeout(() => {
            this.startCountdown();
          }, 900);
        }
      });
      },
      async startCountdown() {
      const initialOpacity = 0;
      const initialScale = 0.5;
      const imageElements = {
        3: this.$refs.countdownImage3,
        2: this.$refs.countdownImage2,
        1: this.$refs.countdownImage1,
        go: this.$refs.countdownImageGo
      };

      Object.values(imageElements).forEach(img => {
        gsap.set(img, { opacity: initialOpacity, scale: initialScale });
      });

      const countdownTimeline = gsap.timeline({ repeat: 0 });

      countdownTimeline.to(imageElements["3"], { duration: 0.5, scale: 1, opacity: 1, ease: "back.out(1.7)" })
                      .to(imageElements["3"], { duration: 0.5, scale: 1, opacity: 1, ease: "power1.inOut" })
                      .to(imageElements["3"], { duration: 0.5, scale: 1, opacity: 1, ease: "power1.inOut" })
                      .to(imageElements["3"], { duration: 0.5, scale: initialScale, opacity: initialOpacity, ease: "back.in(1.7)" })

                      .to(imageElements["2"], { duration: 0.5, scale: 1, opacity: 1, ease: "back.out(1.7)" })
                      .to(imageElements["2"], { duration: 0.5, scale: 1, opacity: 1, ease: "power1.inOut" })
                      .to(imageElements["2"], { duration: 0.5, scale: initialScale, opacity: initialOpacity, ease: "back.in(1.7)" })

                      .to(imageElements["1"], { duration: 0.5, scale: 1, opacity: 1, ease: "back.out(1.7)" })
                      .to(imageElements["1"], { duration: 0.5, scale: initialScale, opacity: initialOpacity, ease: "back.in(1.7)" })

                      .to(imageElements["go"], { duration: 0.5, scale: 1, opacity: 1, ease: "back.out(1.7)" })
                      .to(imageElements["go"], { duration: 0.5, scale: initialScale, opacity: initialOpacity, ease: "back.in(1.7)" , onComplete: ()=>{ this.startGame()}});

      await countdownTimeline.play();
    },

    startGame(){
      this.isCountdown = false;
      this.SetRandomAns();
      this.isRestartNewGame = false;
      sessionStorage.setItem('isRestartNewGame', JSON.stringify(this.isRestartNewGame));
      const tl = gsap.timeline();
      tl.to('.messagebtn',
        {
          duration: 0.2,
          opacity: 1,
        })
    },

      toggleMenuForGame(bool){
        this.isExitClicked = bool;
        this.showExitClicked = bool;
        this.IsAble = false;
      },

      exit(){
        this.isRestartNewGame = true;
        this.isExitClicked = false;
        sessionStorage.setItem('isRestartNewGame', JSON.stringify(this.isRestartNewGame));
        this.$router.push("/Category");
      },
      restart(){
        let isRestartNewGame = true;
        sessionStorage.setItem('isRestartNewGame', JSON.stringify(isRestartNewGame));
        window.location.reload();
      },
      continuebtn(){
        this.showExitClicked = false;
        setTimeout(()=>{
          this.isExitClicked = false;
          this.IsAble = true;
        }, 200)
      },

      async SkipFunc(){
        this.nextQuestion(0);
        await this.animateChangeQuestionVoice2();
      },

      async seveData(){
        const currentPlayerIndex = await this.allPlayerData.findIndex(player => player.name === this.playerName);
        if (currentPlayerIndex !== -1) {
          const lessonIndex = await this.playerData.lesson.findIndex(c => c.guid == this.lessonGuid);
          let logNow = this.playerData.lesson[lessonIndex].log;
          let getalllog = this.playerData.lesson[lessonIndex].alllog; 
          getalllog.push(logNow);
          this.playerData.lesson[lessonIndex].alllog = getalllog;
          this.allPlayerData[currentPlayerIndex] = this.playerData;
          localStorage.setItem('allPlayerData', JSON.stringify(this.allPlayerData));

        }
      },

    },
  };
  </script>

  <style>
  .label{
      position: absolute;
      display: flex;
      justify-content: center;
      width: 100%;
      height: 12%;
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
      font-size: 1.5vw;;
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
    align-items: flex-end;
    justify-content: space-between;
    height: 20%;
    width: 100%;
    overflow: hidden;
    margin-bottom: 1%;
    /* opacity: 0; */
  }

  .sub-sub-container-rl-ab {
    bottom: 0;
    position: absolute;
    position: -webkit-sticky;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20%;
    width: 100%;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.479);
    color: white;
    font-family:"balloo tamma", sans-serif;
    font-size: 24px;
    z-index: 10;
    /* opacity: 0; */
  }

  .messagebtn {
    display: flex;
    height: 30%;
    width: 100%;
    margin-left: 5%;
    flex-direction: row;
    opacity: 0;
  }


  .no-question-style{
    aspect-ratio: 1/1;
    /* flex: 0 1 5%; */
    border: 3px solid #195FCF;
    margin-right: 1%;
    border-radius: 50%;
  }

  .no-question-active{
    background-color: #FFEF00;
    border: 3px solid white;
  }

  .no-question-complete{
    background-color: #195FCF;
  }


  .rlbtn{
    height: 100%;
    margin-right: 5%;
  }

  .next-btn{
    aspect-ratio: 1/1;
    height: 100%;
    width: auto;
    border: none;
    background-color: #DE4339;
    border-radius: 50%;
    font-size: 1.5vw;
    font-weight: 700;
    cursor: pointer;
    color: white;
  }

  .cantainer-overlay{
    display: flex;
    justify-content:center;
    align-items: center;
    position: absolute;
    gap: 10%;
    background-color: rgba(0, 0, 0, 0.815);
    width: 100%;
    height: 100%;
    z-index: 200;
  }

  .countdown-style{
    position: absolute;
    width: auto;
    height:90%;
    opacity: 0;
  }

  .exit{
    height: 100%;
    background-image: url('@/assets/exit_24.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 70%;
    border-radius: 200px;
    border: 10px solid white;
    cursor: pointer;
  }

  .restart{
    height: 100%;
    background-image: url('@/assets/restart_24.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 70%;
    border-radius: 200px;
    border: 10px solid white;
    cursor: pointer;
  }

  .continue{
    height: 100%;
    background-image: url('@/assets/continue_24.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 70%;
    border-radius: 200px;
    background-color: #195FCF;
    border: 10px solid #124699;
    cursor: pointer;
  }
  
  .container-btn{
    aspect-ratio: 1/1;
    height: 35%;
  }

  .test-btn{
    text-align: center;
    font-size: 24px;
    color: white;
    margin-top: 20px;
    font-weight: 700;
  }

  </style>