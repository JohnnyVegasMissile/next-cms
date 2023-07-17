'use server'

import styles from './ImageBlock.module.scss'
import { ViewBlockProps } from '..'
import classNames from 'classnames'
import Image from 'next/image'
import { ContentType } from '.'

const ImageBlock = ({ value, medias }: ViewBlockProps<ContentType>) => {
    const { imageId } = value || {}

    const img = medias?.get(imageId || '')

    return (
        <section className={classNames(styles['section'])}>
            <div className={classNames(styles['image-wrapper'])}>
                <Image fill className="" src={`/storage/images/${img?.uri || ''}`} alt={img?.alt || ''} />
            </div>
        </section>
    )
}

export default ImageBlock
