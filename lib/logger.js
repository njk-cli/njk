import symbols from 'log-symbols'

export const fail = (msg, err) => {
  console.error(`${symbols.error} ${msg} \n ${err.stack || ''}`)
  process.exit(1)
}

export const success = (msg) => {
  console.log(`${symbols.success} ${msg}`)
}

export const warn = (msg) => {
  console.log(`${symbols.warning} ${msg}`)
}

export const log = (msg) => {
  console.log(`${symbols.info} ${msg}`)
}
