<template>
    <PageLoader />
    <div class="container-card">
      <table class="table-style">
        <tr>
          <th>Name</th>
          <th>Lesson</th>
        </tr>
        <tr v-for="(item, index) in allPlayerData" :key="index">
          <td>{{ item.name }}</td>
          <td v-for="(data, index) in item.lesson" :key="index" >
            <div class="col-style">
              <div>Lesson :</div>
              <div>{{ data.guid }}</div>
            </div>
            <div class="col-style">
              <div>Latest date :</div>
              <div>{{ formatDate(data.log.playAt)}}</div>
            </div>
            <div class="col-style">
              <div>score :</div>
              <tddiv>{{ data.score}}</tddiv>
            </div>
          </td>
        </tr>
      </table>
    </div>
</template>

<script>
import PageLoader from "@/components/PageLoader.vue";
  export default {
    components: {
      PageLoader,
    },
    data: () => {
      return {
        isloaded: false,
        progress: 0,
        allPlayerData:[],
      };
    },
    async mounted() {
        this.allPlayerData = await JSON.parse(localStorage.getItem('allPlayerData')) || [];
    },
    methods: {
      formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      }
    }
  };
  </script>
  
  <style scoped>
.container-card{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: auto;
}
.table-style{
  background-color: aliceblue;
  border-radius: 25px;
  padding: 20px;
  width: 50%;
  height: 90%;
}

table, th, td{
  border: 1px solid black;
  border-radius: 5px;
}
table td{
  padding: 10px;
}

.col-style{
  display: flex;
}
  </style>
  