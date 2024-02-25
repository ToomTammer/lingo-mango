<template>
  <div v-if="false" id="div" class="d-grid gap-2 col-6 mx-auto d-flex justify-content-center">
    <img class="logo" src="@/assets/logoTest.png">
    <img class="button" src="@/assets/start_btn.png">
  </div>
  <inputName v-if="false" ></inputName>
  <category></category>
</template>


<script  >
import inputName from '@/components/InputNameView.vue';
import category from '@/components/CategoryView.vue';
export default {
  components: {
    inputName,
    category
  },
};
</script>


<style scoped>
#div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  top: 0;
  width: 100% !important;
  height: 100% !important;
  background-color: rgba(243, 226, 205, 0.082);
}
.logo{
  object-fit:contain;
  width: auto;
  height: 20%;
  margin-bottom: 1.5%;
}
.button{
  cursor: pointer;
  width: auto;
  height: 10%;
  transition: 0.3s;
}
.button:hover{
  filter:drop-shadow(0 0 5px #9e7715);
}

</style>