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

const Edit = ({ defaultValues, onChange }: Props) => {
    const [values, setValues] = useState<any>(parseDefaultValue(defaultValues))

    const handleChange = (name: string, value: any) => {
        const newValue = { [name]: value }

        setValues(newValue)

        try {
            if (onChange) onChange(JSON.stringify(newValue))
        } catch (e) {
            console.log('Error on edit')
        }
    }

    return (
        <section className={styles.section}>
            <input value={values?.name} onChange={(e) => handleChange('name', e.target.value)} />
        </section>
    )
}

export default Edit
