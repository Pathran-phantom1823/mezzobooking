<template>
  <div style="margin: 56px;">
    <filter-product v-bind:category="category" 
      :activeCategoryIndex="0"
      :activeSortingIndex="0"
      @changeSortEvent="retrieve($event.sort, $event.filter)"
      :grid="['list']">
    </filter-product>
    <div style="float:left">
    <Pager
      :pages="numPages"
      :active="activePage"
      :limit="limit"
      v-if="data !== null"
    /></div>
     <button v-if="data.length > 0" class="btn btn-primary pull-right" style="margin-bottom: 25px;" @click="exportData()">Export to CSV</button>
    <table v-if="data !== null && data.length > 0" class="table table-bordered table-responsive">
      <tbody v-if="data" style="height:102px;">
        <tr v-for="(item, index) in data" :key="index" class="table-row" @click="redirect()">
          <td style="padding:0px !important">
            <div class="row" style="margin-left: 2%;padding-right: 2%">
              <div class="col-md-6" style="padding: 20px 0px">
                <b><span style="font-size: 12px">Cutomer ID: {{item.id}}</span></b><br/>
                <span style="font-size: 24px; font-weight: bold">{{item.name !== " " ? item.name : item.username}}</span><br/>
                <span style="font-size: 12px">{{item.cellular_number !== null ? item.cellular_number : 'N/A'}} / {{item.email}}</span>
              </div>
              <div class="col-md-6 column">
                <div class="box mr-1">
                  <p class="box-title">Total Bookings</p>
                  <span><b>{{item.total_bookings}}</b></span>
                </div>
                <div class="box">
                  <p class="box-title">Total Spent</p>
                  <span><b>PHP{{item.total_spent}}</b></span>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- <button v-if="data.length > 0" class="btn btn-primary pull-right" style="margin-bottom: 25px;" @click="retrieve(currentSort, currentFilter, true)">See More</button> -->
    <empty v-if="data === null || data.length === 0" :title="'Empty Customers!'" :action="'No activity at the moment.'"></empty>
    <confirmation
    :title="'Confirmation Modal'"
    :message="'Are you sure you want to delete ?'"
    ref="confirms"
    @onConfirm="remove()"
    >
    </confirmation>
    <show-booking ref="booking"/>
  </div>
</template>
<script>
import AUTH from 'src/services/auth'
import moment from 'moment'
import Pager from 'src/components/increment/generic/pager/PagerEnhance.vue'
import { ExportToCsv } from 'export-to-csv'
import COMMON from 'src/common.js'
export default {
  mounted() {
    this.retrieve({'username': 'asc'}, {column: 'username', value: ''}, false)
  },
  data() {
    return {
      editId: null,
      user: AUTH.user,
      activeSortTitle: null,
      reservee: null,
      datetime: null,
      status: null,
      guest: null,
      data: [],
      category: [{
        title: 'Sort By',
        sorting: [{
          title: 'Username ascending',
          payload: 'username',
          payload_value: 'asc'
        }, {
          title: 'Username descending',
          payload: 'username',
          payload_value: 'desc'
        }, {
          title: 'Email ascending',
          payload: 'email',
          payload_value: 'asc'
        }, {
          title: 'Email descending',
          payload: 'email',
          payload_value: 'desc'
        }]
      }],
      currentFilter: null,
      currentSort: null,
      offset: 0,
      limit: 5,
      id: null,
      synqt: null,
      reservationStatus: false,
      click: false,
      numPages: null,
      activePage: 1
    }
  },
  components: {
    'filter-product': require('components/increment/ecommerce/filter/RoundedFilter.vue'),
    'empty': require('components/increment/generic/empty/Empty.vue'),
    'confirmation': require('components/increment/generic/modal/Confirmation.vue'),
    'show-booking': require('modules/booking/ReserveeInformation.vue'),
    Pager
  },
  methods: {
    retrieve(sort, filter, flag){
      if(flag === true) {
        this.offset += this.limit
      }
      if(filter !== null){
        this.currentFilter = filter
      }
      if(sort !== null){
        this.currentSort = sort
      }
      let parameter = {
        condition: [{
          value: this.currentFilter.value ? '%' + this.currentFilter.value + '%' : '%%',
          column: this.currentFilter.column,
          clause: 'like'
        }],
        limit: this.limit,
        offset: (this.activePage > 0) ? ((this.activePage - 1) * this.limit) : this.activePage,
        sort: sort !== null ? sort : this.currentSort
      }
      $('#loading').css({'display': 'block'})
      console.log(flag)
      this.APIRequest('accounts/retrieve_accounts_mezzo', parameter).then(response => {
        $('#loading').css({'display': 'none'})
        if(response.data.length > 0){
          this.numPages = parseInt(response.size / this.limit) + (response.size % this.limit ? 1 : 0)
          if(flag === true) {
            response.data.forEach(element => {
              element.date_time_at_human = moment(new Date(element.datetime)).format('MMMM Do YYYY, hh:mm a')
              this.data.push(element)
            })
          } else {
            response.data.forEach(element => {
              element.date_time_at_human = moment(new Date(element.datetime)).format('MMMM Do YYYY, hh:mm a')
            })
            this.data = response.data
          }
        }else{
          this.data = []
          this.numPages = null
        }
      })
    },
    update(){
      let parameter = {
        id: this.editId,
        status: this.status
      }
      $('#loading').css({'display': 'block'})
      this.APIRequest('reservations/update', parameter).then(response => {
        $('#loading').css({'display': 'none'})
        if(response.data !== null){
          $('#editBooking').modal('hide')
          this.APIRequest('mezzo/update', {id: this.synqt, status: this.status}).then(response => {
            console.log(response)
          })
          this.retrieve(this.currentSort, this.currentFilter, false)
        }
      })
    },
    remove(){
      let parameter = {
        id: this.id
      }
      $('#loading').css({'display': 'block'})
      this.APIRequest('reservations/delete', parameter).then(response => {
        $('#loading').css({'display': 'none'})
        if(response.data !== null){
          this.retrieve(this.currentSort, this.currentFilter, false)
        }
      })
    },
    redirect(){
    },
    exportData(){
      let options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        showTitle: true,
        title: 'MezzoHotel-Customer List',
        useTextFile: false,
        useBom: true,
        // useKeysAsHeaders: true,
        filename: COMMON.APP_NAME,
        headers: ['Customer Id', 'Name', 'Email', 'Phone', 'Total Spent', 'Total Bookings']
      }
      var exportData = []
      if(this.data.length > 0){
        for (let index = 0; index < this.data.length; index++) {
          const item = this.data[index]
          let obj = {
            customer_id: item.id,
            name: item.name !== ' ' ? item.name : item.username,
            email: item.email,
            phone: item.cellular_number !== null ? item.cellular_number : 'N/A',
            total_spent: item.total_spent,
            total_bookings: item.total_bookings
          }
          exportData.push(obj)
        }
      }
      if(exportData.length > 0){
        var csvExporter = new ExportToCsv(options)
        csvExporter.generateCsv(exportData)
      }
    }
  }
}
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})
</script>
<style lang="scss" scoped>
@import "~assets/style/colors.scss";
  .table{
    border-collapse:separate !important;
    border-spacing:0 15px !important;
    border: none;
    padding: 0;
  }
  .btn{
    width: 200px;
    height: 50px
  }
  .table-row{
    background-color:white;
  }
  .box{
    border: 1px $gray solid;
    padding: 10px;
    width: 40%;
    text-align: center;
    margin-top: 20px;
  }
  .column div{
    float: right;
    clear: none;
    margin-right: 2%;
  }
  .box-title{
    color: $secondary;
  }
</style>
