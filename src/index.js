import postcss from 'postcss'
import pkg from '../package.json'
import Adaptive from './adaptive'

export default postcss.plugin(pkg.name, (options) => {
  return (css, result) => {
    const adaptiveIns = new Adaptive(options)
    const output = adaptiveIns.parse(css.toString())
    result.root = postcss.parse(output)
  }
})
