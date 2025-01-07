import { withNoopInstall } from '../../utils/vue'
import Form from './src/index.vue'
import FormItem from './src/index.vue'


const TiForm = withNoopInstall(Form)
const TiFormItem = withNoopInstall(FormItem)

export default {
  TiForm,
  TiFormItem,
}