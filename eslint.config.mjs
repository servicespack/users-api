import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'node/prefer-global/process': 'off',
    'antfu/no-top-level-await': 'off',
  },
})
