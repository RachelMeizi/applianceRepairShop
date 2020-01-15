<template>
	<view>
		<form @submit="formSubmit" report-submit='true' class="layout">
		  <button form-type="submit" class="button" hover-class="none">
		    <view class="fixed"><slot></slot></view>
		  </button>
		</form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods:{
			 formSubmit (e) {
			      let formId = e.detail.formId
				  console.log(formId,'子组件-formid')
				  
				  // this.$util.get('xxx?formId='+formId).then(res=>{//调起收集formid的接口					  
				  // })
				  this.$emit('formSubmit',formId)
			    }
		}
	}
</script>

<style lang="scss">
.layout {
    display: inline-block;
    padding-left: 0;
    padding-right: 0;
    box-sizing: border-box;
    font-size: inherit;
    text-align: left;
    text-decoration: none;
    line-height: inherit;
    -webkit-tap-highlight-color: transparent;
    color: inherit;
    width: 100%;
    position: relative;
}
.layout .button{
    display: inline-block;
    padding-left: 0;
    padding-right: 0;
    box-sizing: border-box;
    font-size: inherit;
    text-align: left;
    text-decoration: none;
    line-height: inherit;
    -webkit-tap-highlight-color: #000;
    color: inherit;
    width: 100%;
    position: relative;
}
.layout .button .fixed{
    position:relative;
    z-index: 9999;
    width: 100%;
}
.layout .button:before,.layout .button:after{
    border-width: 0;
}
</style>
