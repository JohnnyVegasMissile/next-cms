import { useState } from 'react'
import styles from './example.module.scss'
interface Props {
    defaultValues: string
    onChange: (values: string) => void
}

const Edit = ({ defaultValues, onChange }: Props) => {
    const [values, setValues] = useState(JSON.parse(defaultValues))

    return <section className={styles.section}>Edit</section>
}

export default Edit
