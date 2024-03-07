<template>
     <div class="container-input">
      <div class="respresent-logo"></div>
      <div class="align-input">
        <div class="sub-container-input">
          <input class="input" type="text" placeholder="What's your name?" autofocus required v-model="inputData" maxlength="12"/>
          <p v-if="err" style="color: red;">{{ errorMessage }}</p>
        </div>
        <img class="button" src="@/assets/start_btn.png" @click="validateAndSendData">
      </div>
     </div>
</template>

<script>
export default {
  data() {
    return {
      inputData: JSON.parse(sessionStorage.getItem('playerName')) || '',
      errorMessage: '',
      err:false,
    };
  },
  methods: {
    validateAndSendData() {
      if (this.validateInput()) {
        this.$emit('playerName', this.inputData);
      }
    },
    validateInput() {
      if (!this.inputData) {
        this.errorMessage = "Please enter your name.";
        this.err = true;
        return false;
      }
      this.err = false;
      return true;
    }
  }
}
</script>

<style scoped>
.respresent-logo{
  height: 30%;
  width: 100%;
  margin-bottom: 40px;
}

.txt{
    font-size: 3vw;
    font-weight: 600;
    font-family:"balloo tamma", sans-serif;
}
.input{
    width: 100%;
    height: 100%;
    padding: 10px 20px;
    border: none;
    border-radius: 15px;
    text-align: center;
    font-size: 24px;
    font-family:"balloo tamma", sans-serif;
}
.button{
  cursor: pointer;
  width: 15%;
  height: auto;
  transition: 0.3s;
}
.logo{
  object-fit:contain;
  width: auto;
  height: 5%;
}
.container-input{
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 50px;
}

.align-input{
  width: 100%;
  height: auto;
  flex-direction: column;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.sub-container-input{
  margin-bottom: 20px;
  height: 60%;
  width: 50%;
  flex-direction: column;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

</style>