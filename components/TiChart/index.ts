import { withNoopInstall } from '../../utils/vue'
import Chart from './src/index.vue'

const TiChart = withNoopInstall(Chart)
export default TiChart

// export * from './src/index.vue'