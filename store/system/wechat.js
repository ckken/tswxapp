/**
 * Created by ken on 2017/4/16.
 */
import {autorun, observable, computed, action} from 'utils/mobx'
export default class {
  @observable route = {}
  @observable system = {}


  @action InitRoute(options) {
    this.route = options
  }

  @action async getSystem() {
    this.system = await wx.getSystemInfo()
  }
}
