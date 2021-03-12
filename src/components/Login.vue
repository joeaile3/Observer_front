<template>

  <div class="col-md-12 ">
    <div class="text-right">
      <button class="p-relative ml-8 btn-vue btn-lg col-2 btn btn-primary" @click="redirectToRegister()">Register</button>
    </div>
    <div class=" mx-auto form col-md-8 rounded  px-5 py-4 shadow bg-white text-left " >
      <form @submit.prevent="submit()">
        <div class="row align-items-center justify-content-center">
          <div class="col-12 form-group">
            <label class="col-form-label col-form-label-lg">Email <span class="text-danger">*</span></label>
            <input type="text" v-model="email"  @input="setEmail($event.target.value)" class="form-control form-control-lg" :class="{'is-invalid': validationStatus($v.email)}" >
            <div v-if="errors && errors.email" class="text-danger">{{ errors.email[0] }}</div>
            <div v-if="!$v.email.required" class="invalid-feedback">Email is required</div>
          </div>
          <div class="col-12 form-group">
            <label class="col-form-label col-form-label-lg">Password <span class="text-danger">*</span></label>
            <input type="password" v-model="password"   @input="setPassword($event.target.value)" :class="{'is-invalid': validationStatus($v.password)}" class="form-control form-control-lg">
            <div v-if="errors && errors.password" class="text-danger">{{ errors.password[0] }}</div>
            <div v-if="!$v.password.required" class="invalid-feedback">Password is required</div>
          </div>
          <div class="col-12 form-group text-center">
            <button class="btn btn-vue btn-lg col-4 btn btn-primary">Submit</button>
          </div>
        </div>
      </form>
    </div>
  </div>

</template>

<script>
import {required} from 'vuelidate/lib/validators';
export default {
  name: "Login",
  data(){
    return {
      email:'',
      password:'',
      errors:{}
    }
  },
  validations:{
  email:{required},
    password:{required}
  },

  methods:{
    validationStatus: function (validation) {
      return typeof validation != "undefined" ? validation.$error : false;
    },
    setEmail(value)
    {
      this.email=value;
      this.$v.email.$touch();
    },
    setPassword(value)
    {
      this.password=value;
      this.$v.password.$touch();
    },

    submit()
    {
      this.$v.$touch();
      if (this.$v.$pendding || this.$v.$error) return;
      const axios=require('axios');
      const data = new FormData();
      data.append('email',this.email);
      data.append('password',this.password);
      axios.post(('api/login'),data).then(response => {
        localStorage.setItem("access_token", response.data.plainTextToken);
        axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.plainTextToken;
        this.$router.push('/dashboard');

      }).catch(error => {
        if (error.response.status == 422)
        {
          this.errors = error.response.data.errors;
        }
        if (error.response.status == 401)
        {
          alert(error.response.data);
        }

      });
    },
    redirectToRegister()
    {
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>

</style>