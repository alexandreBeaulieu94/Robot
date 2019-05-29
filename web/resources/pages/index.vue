<template>
  <section class="container">
    <div>
      <b-row align-h="center">
        <logo/>
      </b-row>

      <div class="row">
        <div id="app">
          <div class="medium-6 columns">
            <label>Type Something
              <p>Le message est : {{ this.keyboardInput}}</p>
            </label>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script>
  import Logo from '~/components/Logo.vue'
  import axios from 'axios'

  // https://anders.com/blockchain/tokens.html
  export default {
    async asyncData(args) {
    },
    data() {
      return {
        keyboardInput:"a"
      }
    },
    components: {
      Logo
    },
    mounted() {
      window.bob = this

      window.addEventListener('keyup', function(ev) {
        this.keyboardInput = ev.code
        console.log(this.keyboardInput)

        axios.get(`/updateLastKeyboardInput?keyboardInput=` + this.keyboardInput)


      });
    }
  }
</script>

<style lang="scss" scoped>
  input[readonly] {
    background-color: rgba(0, 0, 0, 0.1)
  }
</style>
