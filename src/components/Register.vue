<template>

  <div class="col-md-12 ">
    <div class="text-right">
      <button class="p-relative ml-8 btn-vue btn-lg col-2 btn btn-primary" @click="redirectToLogin">Login</button>
    </div>
    <div class=" mx-auto form col-md-8 rounded  px-5 py-4 shadow bg-white text-left ">
      <form @submit.prevent="submit()">
        <div class="row align-items-center justify-content-center">
          <div class="col-12 form-group">
            <label class="col-form-label col-form-label-lg">First Name <span class="text-danger">*</span></label>
            <input type="text" v-model.trim="$v.first_name.$model"  @input="setFirstName($event.target.value)"
                   :class="{'is-invalid': validationStatus($v.first_name)}" class="form-control form-control-lg">
            <div v-if="errors && errors.first_name" class="text-danger">{{ errors.first_name[0] }}</div>
            <div v-if="!$v.first_name.required" class="invalid-feedback"> First Name is required</div>
            <div v-if="!$v.first_name.alpha" class="invalid-feedback"> Use only alphabetical characters</div>
            <div v-if="!$v.first_name.minLength || !$v.first_name.minLength" class="invalid-feedback"> First Name must be between {{$v.first_name.$params.minLength.min}} and {{$v.first_name.$params.maxLength.max}} characters </div>
          </div>
          <div class="col-12 form-group">
            <label class="col-form-label col-form-label-lg">Last Name <span class="text-danger">*</span></label>
            <input type="text" v-model="last_name" :class="{'is-invalid': validationStatus($v.last_name)}"
                   class="form-control form-control-lg"  @input="setLastName($event.target.value)">
            <div v-if="errors && errors.last_name" class="text-danger">{{ errors.last_name[0] }}</div>
            <div v-if="!$v.last_name.required" class="invalid-feedback"> Last Name is required</div>
            <div v-if="!$v.last_name.alpha" class="invalid-feedback"> Use only alphabetical characters</div>
            <div v-if="!$v.last_name.minLength || !$v.last_name.minLength" class="invalid-feedback"> Last Name must be between {{$v.last_name.$params.minLength.min}} and {{$v.last_name.$params.maxLength.max}} characters </div>
          </div>
          <div class="col-12 form-group">
            <label class="col-form-label col-form-label-lg">Email <span class="text-danger">*</span></label>
            <input type="email" v-model="email" :class="{'is-invalid': validationStatus($v.email)}"
                   class="form-control form-control-lg" @input="setEmail($event.target.value)">
            <div v-if="errors && errors.email" class="text-danger">{{ errors.email[0] }}</div>
              <div v-if="!$v.email.required" class="invalid-feedback">Email is required</div>
            <div v-if="!$v.email.email" class="invalid-feedback"> Email format is invalid</div>
          </div>
          <div class="col-12 form-group">
            <label class="col-form-label col-form-label-lg">Password <span class="text-danger">*</span></label>
            <input type="password" v-model="password" class="form-control form-control-lg" @input="setPassword($event.target.value)" :class="{'is-invalid': validationStatus($v.password)}">
            <div v-if="errors && errors.password" class="text-danger">{{ errors.password[0] }}</div>
            <div v-if="!$v.password.required" class="invalid-feedback">Password is required</div>
            <div  class="invalid-feedback" v-if="!$v.password.between">Password should be at least {{$v.password.$params.minLength.min}} characters</div>
          </div>
          <div class="col-12 form-group">
            <label class="col-form-label col-form-label-lg">Confirm Password <span class="text-danger">*</span></label>
            <input type="password" v-model="password_confirmation" @input="setConfirmPassword($event.target.value)" class="form-control form-control-lg" :class="{'is-invalid': validationStatus($v.password_confirmation)}">
            <div v-if="errors && errors.password_confirmation" class="text-danger">{{errors.password_confirmation[0]}}</div>
            <div v-if="!$v.password_confirmation.required" class="invalid-feedback"> Password Confirmation is required</div>
            <div v-if="!$v.password_confirmation.sameAs" class="invalid-feedback"> Passwords don't match</div>
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
import {required, minLength, sameAs, email, alpha, maxLength} from 'vuelidate/lib/validators';

export default {

  name: "Register",
  data() {
    return {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password_confirmation: '',
      errors: {},
    }
  },
  validations: {
    first_name: {required, alpha, minLength: minLength(3), maxLength:maxLength(8)},
    last_name: {required, alpha, minLength: minLength(4),maxLength:maxLength(8)},
    email: {required, email},
    password: {required, minLength:minLength(8)},
    password_confirmation: {required, sameAs: sameAs('password')}

  },

  mounted() {
    if (localStorage.getItem("access_token") !== null) {
      this.$router.push('/dashboard');
    }
  },

  methods:
      {
        setFirstName(value) {
          this.first_name = value
          this.$v.first_name.$touch()
        },
        setLastName(value) {
          this.last_name = value
          this.$v.last_name.$touch()
        },
        setEmail(value) {
          this.email = value
          this.$v.email.$touch()
        },
        setPassword(value) {
          this.password = value
          this.$v.password.$touch()
        },
        setConfirmPassword(value) {
          this.password_confirmation = value
          this.$v.password_confirmation.$touch()
        },
    validationStatus: function (validation) {
      return typeof validation != "undefined" ? validation.$error : false;
    },
    submit() {

      this.$v.$touch();
      if (this.$v.$pendding || this.$v.$error) return;
      const axios = require('axios');
      const data = new FormData();
      data.append('first_name', this.first_name);
      data.append('last_name', this.last_name);
      data.append('email', this.email);
      data.append('password', this.password);
      data.append('password_confirmation', this.password_confirmation);
      axios.post(('api/register'), data).then(response => {
        localStorage.setItem("access_token", response.data.plainTextToken);
        axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.plainTextToken;
        this.$router.push('/dashboard');

      }).catch(error => {
        if (error.response.status == 422) {
          this.errors = error.response.data.errors;
          console.log(this.errors);
        }

      });
    },
    redirectToLogin() {
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>

</style>