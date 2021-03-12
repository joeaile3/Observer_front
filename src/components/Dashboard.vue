<template>
  <div>
<div>
  First name {{this.info["first_name"]}}
</div>
  <div>
    Last name {{this.info["last_name"]}}
  </div>
  <div>
    Email {{this.info["email"]}}
  </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      token:'',
      info:{},
    }
  },
  mounted(){
    const axios=require('axios');
    this.token=localStorage.getItem("access_token");
    if(this.token==null)
    {
      this.$router.push('/');
    }
    else{
      axios.defaults.headers.common["Authorization"] = "Bearer " + this.token;
      axios.get(('api/getUser')).then(response => {

       this.info=response.data;

      }).catch(error => {
        console.log(error);

      });
    }
  },
  name: "Dashboard"
}
</script>

<style scoped>

</style>