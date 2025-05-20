import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,

  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: false,
  },
})
