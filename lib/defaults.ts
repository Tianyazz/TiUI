import { makeInstaller } from './make-installer'
import loadComponents from './components'
// import components from './components'

const components = await loadComponents()
export default makeInstaller([...components])
