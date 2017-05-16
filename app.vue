<script type="text/babel">
  import vco from 'vco'
  import {observer, inject} from 'utils/mobx-wechat'
  const WechatStore = 'system/wechat'
  @inject(WechatStore)
  @observer
  export default class extends vco.app {
    async onLaunch(options) {
      this.store[WechatStore].InitRoute(options)// 路由初始化
    }
  }

</script>
<style rel="stylesheet/less">
  @import "less/color";
  .container {
    box-sizing: border-box;
    width: 100%;
    overflow-x: hidden;
  }
</style>
