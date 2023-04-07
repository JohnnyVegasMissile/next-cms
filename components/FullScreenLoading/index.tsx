import { Spin } from 'antd'
import styles from './FullScreenLoading.module.scss'

interface FullScreenLoadingProps {
    label?: string
}

const FullScreenLoading = ({ label = 'Loading...' }: FullScreenLoadingProps) => (
    <div className={styles['wrapper']}>
        <Spin size="large" tip={label} />
    </div>
)

export default FullScreenLoading
