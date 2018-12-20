<template lang="pug">
  div
    span.myLabel
      | Go to
    select(@change="jump(href)", v-model="href")
      //option(value="/standalone") Use this widget standalone
      //option(value="/ADLEntryNotice") ZZZZZ Old entry notice
      option(value="/practice1") Practice Screen 1
      option(value="/practice2") Practice Screen 2
      option(value="/practice3") Practice Screen 3
      option(value="/practice4") Practice Screen 4
      option(value="/practice5") Practice Screen 5
      option(value="/practice1") -----

      option(value="/inspection") Inspection Report
      option(value="/practice1") -----

      option(value="/AUQLDREPMT13") Entry Notice
      option(value="/AUQLDREPMT14") Notice Intention To Sell
      option(value="/AUQLDREPMT15") Notice Remedy Breach
      option(value="/AUQLDREPMT17") Notice To Leave
      option(value="/AUQLDREPMT24") Abandonment Termination Notice
      option(value="/AUQLDREPMT25") Dispute Resolution Request
      option(value="/AUQLDREPMT39") Entry Notice - Rooming Accommodation
      option(value="/AUQLDREPMT40") Notice Remedy Breach - Rooming Accommodation
      option(value="/AUQLDREPMT41") Notice Leave - Rooming Accommodation
      option(value="/AUQLDREPMT47") Notice Rent Increase
</template>

<script>
export default {
  data () {
    return {
      href: null
    }
  },
  methods: {
    jump: function(href) {
      window.location = href;
    }
  }
}
</script>

<style lang="scss" scoped>
  .myLabel {
    display: inline-block;
    font-size: 12px;
    //margin-left: 20px;
    margin-right: 10px;
    //color: #999;
  }
</style>
