import css from 'css'

const PX_REG = /\b(\d+(\.\d+)?)px\b/
const PX_GLOBAL_REG = new RegExp(PX_REG.source, 'g')

export default class Adaptive {
  constructor (options) {
    const defaultConfig = {
      baseDpr: 2,                // base device pixel ratio (default: 2)
      remUnit: 75,               // rem unit value (default: 75)
      remPrecision: 6,           // rem value precision (default: 6)
      hairlineClass: 'hairlines' // class name of 1px border (default 'hairlines')
    }
    this.config = Object.assign({}, defaultConfig, options)
  }

  parse (code) {
    const astObj = css.parse(code)
    this._processRules(astObj.stylesheet.rules)
    return css.stringify(astObj)
  }

  _processRules (rules, noDealHairline = false) { // FIXME: keyframes do not support `hairline`
    const { hairlineClass } = this.config

    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i]

      if (rule.type === 'media') {
        this._processRules(rule.rules) // recursive invocation while dealing with media queries
        continue
      }
      else if (rule.type === 'keyframes') {
        this._processRules(rule.keyframes, true) // recursive invocation while dealing with keyframes
        continue
      }
      else if (rule.type !== 'rule' && rule.type !== 'keyframe') {
        continue
      }

      // generate a new rule which has class `.hairline`
      let newRule = {}
      if (!noDealHairline) {
        newRule = {
          type: rule.type,
          selectors: rule.selectors.map((sel) => `.${hairlineClass} ${sel}`),
          declarations: []
        }
      }

      const declarations = rule.declarations
      for (let j = 0; j < declarations.length; j++) {
        const declaration = declarations[j]

        // need transform: declaration && has 'px'
        if (declaration.type === 'declaration' && PX_REG.test(declaration.value)) {
          const nextDeclaration = declarations[j + 1]

          // no transform & transform to `rem`
          if (nextDeclaration && nextDeclaration.type === 'comment') {
            const commentContent = nextDeclaration.comment.trim()
            if (commentContent === 'no' || commentContent === 'rem') {
              if (commentContent === 'rem') {
                declaration.value = this._getCalcValue('rem', declaration.value)
              }
              declarations.splice(j + 1, 1) // delete corresponding comment
              continue
            }
          }

          // generate a new rule of `hairline`
          if (!noDealHairline && this._needHairline(declaration.value)) {
            const newDeclaration = Object.assign({}, declaration)
            newDeclaration.value = this._getCalcValue('px', declaration.value, true)
            newRule.declarations.push(newDeclaration)
          }

          // common transform
          declaration.value = this._getCalcValue('px', declaration.value)
        }
      }

      // add the new rule of `hairline` to stylesheet
      if (!noDealHairline && newRule.declarations.length) {
        rules.splice(i + 1, 0, newRule)
        i++ // skip the added new rule
      }
    }
  }

  _getCalcValue (type, value, isHairline = false) {
    const { baseDpr, remUnit, remPrecision } = this.config

    function getValue (val) {
      val = parseFloat(val.toFixed(remPrecision)) // control decimal precision of the calculated value
      return val === 0 ? val : val + type
    }

    return value.replace(PX_GLOBAL_REG, ($0, $1) => {
      $1 = Number($1)
      return $1 === 0 ? 0 :
        type === 'rem' ? getValue($1 / remUnit) :
        !isHairline && $1 / baseDpr < 1 ? getValue($1) :
        getValue($1 / baseDpr > 0.5 ? $1 / baseDpr : 0.5)
    })
  }

  _needHairline (value) {
    const { baseDpr } = this.config
    const match = value.match(PX_GLOBAL_REG)

    if (match) {
      return match.some((pxVal) => {
        const num = pxVal.match(PX_REG)[1] / baseDpr
        return num > 0 && num < 1
      })
    }

    /* istanbul ignore next */
    return false
  }
}
