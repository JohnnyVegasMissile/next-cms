'use server'

import styles from './ImageBlock.module.scss'
import { ViewBlockProps } from '..'
import classNames from 'classnames'
import Image from 'next/image'
import { ContentType } from '.'

const ImageBlock = ({ content, medias }: ViewBlockProps<ContentType>) => {
    const { imageId } = content || {}

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
