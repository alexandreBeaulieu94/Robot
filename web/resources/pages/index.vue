<template>
  <section class="container">
    <div>
      <b-row align-h="center">
        <logo/>
      </b-row>

      <b-card v-for="(block, idx) in blocks" class="my-5" :id="`block-` + idx"
              :border-variant="block.isValid === 0 ? 'success' : 'danger'"
              :key="idx">
        <b-form-group class="font-weight-bold" label="Bloc:" label-cols="2" label-align="right" label-for="bloc">
          <b-input-group prepend="#">
            <b-input-group-append class="flex-grow-1">
              <b-form-input type="number" id="bloc" v-model="block.id" readonly></b-form-input>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>

        <b-form-group class="font-weight-bold" label="Preuve:" label-cols="2" label-align="right" label-for="preuve">
          <b-form-input type="number" id="preuve" v-model="block.preuve" readonly></b-form-input>
        </b-form-group>

        <b-form-group class="font-weight-bold" label="Écritures:" label-cols="2" label-align="right">
          <b-input-group v-for="(ecriture, i) in block.ecritures" :key="i">
            <b-input-group-prepend is-text>$</b-input-group-prepend>
            <b-input-group-prepend>
              <b-form-input v-model="ecriture.montant" readonly></b-form-input>
            </b-input-group-prepend>
            <b-input-group-prepend is-text>De:</b-input-group-prepend>
            <b-input-group-prepend>
              <b-form-input v-model="ecriture.from" readonly></b-form-input>
            </b-input-group-prepend>
            <b-input-group-prepend is-text>-></b-input-group-prepend>
            <b-input-group-prepend>
              <b-form-input v-model="ecriture.to" readonly></b-form-input>
            </b-input-group-prepend>
          </b-input-group>
        </b-form-group>

        <b-form-group class="font-weight-bold" label="Précédent:" label-cols="2" label-align="right"
                      label-for="precedent">
          <b-form-input id="precedent" v-model="block.hashPrecedant" readonly></b-form-input>
        </b-form-group>
        <b-form-group class="font-weight-bold" label="Hash:" label-cols="2" label-align="right" label-for="hash">
          <b-form-input id="hash" v-model="block.hashCourant" readonly></b-form-input>
        </b-form-group>
        <b-form-group class="font-weight-bold" label="Mineur:" label-cols="2" label-align="right" label-for="mineur">
          <b-form-input id="mineur" v-model="block.signerPar" readonly></b-form-input>
        </b-form-group>

        <b-row>
          <b-col cols="auto" class="ml-auto">
            <b-btn-group>
              <b-btn v-if="idx > 0 " :href="'#block-' + (idx-1)">Précédent</b-btn>
              <b-btn v-if="blocks[idx+1]" :href="'#block-' + (idx+1)">Suivant</b-btn>
            </b-btn-group>

            <b-col sm="2">
              <label :for="selectMineur">Mineurs</label>
            </b-col>
            <b-form-select  id="selectMineur" v-show="block.preuve === null" v-model="selected" >
              <option v-for="mineur in mineurs" v-bind:value="mineur.id">
                {{ mineur.pseudonyme }}
              </option>
            </b-form-select>

            <b-btn variant="primary" v-show="block.preuve === null" @click="onSubmit(block,selected)">mine</b-btn>
          </b-col>
        </b-row>
      </b-card>
    </div>
  </section>
</template>

<script>
  import Logo from '~/components/Logo.vue'
  import axios from 'axios'

  // https://anders.com/blockchain/tokens.html
  export default {
    async asyncData(args) {
      const { $axios } = args
      let blocks = await $axios.$get('/block')
      let mineurs = await $axios.$get('/mineurs')
      return { blocks,mineurs }
    },
    data() {
      return {
        ecritures: [],
        selected: 1
      }
    },
    components: {
      Logo
    },
    mounted() {
      window.bob = this
    },
    methods: {
      onSubmit(block,selected) {
        axios.get(`/mine/${block.id}-${selected}`)
        location.reload()

      }
    }
  }
</script>

<style lang="scss" scoped>
  input[readonly] {
    background-color: rgba(0, 0, 0, 0.1)
  }
</style>
