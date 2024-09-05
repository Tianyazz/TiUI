import { withNoopInstall } from '../../utils/vue'
import Button from './src/index.vue'

const TiButton = withNoopInstall(Button)
export default TiButton

// export * from './src/index.vue'