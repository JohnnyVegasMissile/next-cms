import classNames from 'classnames'
import styles from './TextBlock.module.scss'
import { ViewBlockProps } from '..'
import { ContentType } from '.'
import StyledDisplay from '~/components/StyledDisplay'

const View = ({ value }: ViewBlockProps<ContentType>) => {
    const { text } = value || {}

    return (
        <section className={classNames(styles['section'])}>
            <div className={classNames(styles['container'])}>
                {!!text && <StyledDisplay className={classNames(styles['text'])}>{text}</StyledDisplay>}
            </div>
        </section>
    )
}

export default View
