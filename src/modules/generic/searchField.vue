<template>
  <div>
    <Multiselect style="width:100%" v-if="test === 'payload'" v-model="features" tag-placeholder="Search Tag" :placeholder="placeholder" :searchable="false" :close-on-select="false" :clear-on-select="false" label="payload_value" track-by="id" :options="items" :multiple="true" @input="returnFeature()"></Multiselect>
    <Multiselect style="width:100%" v-else-if="(test === 'target')" v-model="targets" tag-placeholder="Search Tag" :placeholder="placeholder" :searchable="false" :close-on-select="false" :clear-on-select="false" label="payload_value" track-by="id" :options="items" :multiple="true" @input="returnTarget()"></Multiselect>
    <Multiselect style="width:100%" v-else v-model="add_ons" tag-placeholder="Search Tag" :placeholder="placeholder" :searchable="false" :close-on-select="false" :clear-on-select="false" label="title" track-by="id" :options="items" :multiple="true" @input="returnAddOn()"></Multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
export default {
  props: ['items', 'placeholder', 'styles', 'selectedIndex', 'dropdownItemStyles', 'test', 'isMultiple'],
  data() {
    return {
      features: [],
      add_ons: [],
      targets: []
    }
  },
  components: {
    Multiselect
  },
  methods: {
    returnFeature(){
      this.$emit('onSelect', this.features)
    },
    returnAddOn(){
      this.$emit('onSelectAdd', this.add_ons)
    },
    returnTarget(){
      this.$emit('onSelectTarget', this.targets)
    }
  }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css">
span .multiselect__tag {
    position: relative;
    display: inline-block;
    padding: 4px 26px 4px 10px;
    border-radius: 5px;
    margin-right: 10px;
    color: #fff;
    line-height: 1;
    background: blue;
    margin-bottom: 5px;
    white-space: nowrap;
    overflow: hidden;
    max-width: 100%;
    text-overflow: ellipsis;
}</style>
<style lang="scss" scoped>
@import "~assets/style/colors.scss";
.multiselect__tag{
  background-color: #01009A!important;
}
.inputField{
  outline: none !important;
  box-shadow: none !important;
  border: 0px;
  border-radius: 5px;
  font-weight: 500;
  height: 45px;
  padding-left: 20px;
  padding-right: 20px;
  min-width: 200px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid $gray !important;
}
</style>
