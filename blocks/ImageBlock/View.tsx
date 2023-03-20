import Link from 'next/link'
import styles from './ImageBlock.module.scss'
import { ViewBlockProps } from '..'
import classNames from 'classnames'
import CustomImage from '~/components/CustomImage'

const ImageBlock = ({ content }: ViewBlockProps) => {
    const { title, mediaId, button } = content

    return (
        <section className={classNames(styles['section'])}>
            {title && <h1>Title</h1>}
            {/* <CustomImage media={medias?.get(content.mediaId)} height={400} width={600} /> */}
            {button && (
                <div
                    className={classNames(styles['button'], {
                        [styles['secondary']!]: button.type === 'secondary',
                    })}
                >
                    <Link href={button.label}>
                        <span>{button.label}</span>
                    </Link>
                </div>
            )}
        </section>
    )
}

export default ImageBlock
