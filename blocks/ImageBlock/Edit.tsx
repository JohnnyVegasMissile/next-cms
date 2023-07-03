import useSection from '~/hooks/useSection'
import { EditBlockProps } from '..'
import MediaModal from '~/components/MediaModal'
import { MediaType } from '@prisma/client'
import classNames from 'classnames'
import styles from './ImageBlock.module.scss'
import Image from 'next/image'
import { ContentType } from '.'

const ImageBlock = ({ position }: EditBlockProps) => {
    const { errors, content, medias, addMedia } = useSection<ContentType>(position)
    const { imageId } = content || {}

    const img = medias?.get(imageId || '')

    return (
        <section className={classNames(styles['section'])}>
            <div className={classNames(styles['image-wrapper'], { [styles['error']!]: !!errors?.imageId })}>
                {!!img && (
                    <Image fill className="" src={`/storage/images/${img.uri || ''}`} alt={img.alt || ''} />
                )}
                <div className={classNames(styles['button'])}>
                    <MediaModal
                        value={medias?.get(imageId || '')}
                        onChange={(media) => addMedia('imageId', media)}
                        mediaType={MediaType.IMAGE}
                    />
                </div>
            </div>
        </section>
    )
}

export default ImageBlock
