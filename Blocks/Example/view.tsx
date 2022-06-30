import { useState } from 'react'
import styles from './Example.module.css'

import type { Props } from '../types'

const parseDefaultValue = (values: string) => {
  try {
    return JSON.parse(values)
  } catch (e) {
    return {}
  }
}

const View = ({ defaultValues }: Props) => {
  const [values, setValues] = useState<any>(parseDefaultValue(defaultValues))

  return <section className={styles.section}>View</section>
}

export default View
