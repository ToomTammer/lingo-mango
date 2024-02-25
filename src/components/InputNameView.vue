<template>
     <div id="div" class="d-grid gap-2 col-6 mx-auto d-flex justify-content-center">
        <!-- <img class="logo" src="@/assets/txt_inputName.png"> -->
        <div class="txt">what is your name ?</div>
        <input class="input" type="text" placeholder="Your Name" autofocus>
        <img class="button" src="@/assets/start_btn.png">
     </div>
</template>

<script>
</script>

<style scoped>
.txt{
    font-size: 3vw;
    font-weight: 600;
    font-family:"K2D", sans-serif;
}
.input{
    margin: 2%;
    width: 40%;
    height: 10%;
    background-color: #EDDBB0;
    border: none;
    border-radius: 50px;
    text-align: center;
    font-size: 2vw;
    font-family:"K2D", sans-serif;
}
.button{
  cursor: pointer;
  width: auto;
  height: 10%;
  transition: 0.3s;
}
.logo{
  object-fit:contain;
  width: auto;
  height: 5%;
}
</style>