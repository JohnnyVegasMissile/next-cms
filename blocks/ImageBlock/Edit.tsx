import useSection from '~/hooks/useSection'
import { EditBlockProps } from '..'
import SectionWrap from '~/components/SectionWrap'
import MediaModal from '~/components/MediaModal'
import { MediaType } from '@prisma/client'
import classNames from 'classnames'
import styles from './ImageBlock.module.scss'
import CustomImage from '~/components/CustomImage'
import Link from 'next/link'

const ImageBlock = ({ position }: EditBlockProps) => {
    const { content, setFieldValue, medias, addMedia } = useSection(position)
    const { title, mediaId, button } = content

    return (
        <SectionWrap
            position={position}
            panel={
                <MediaModal
                    value={medias?.get(content.mediaId)}
                    onChange={(media) => addMedia('mediaId', media)}
                    mediaType={MediaType.IMAGE}
                />
            }
        >
            <section className={classNames(styles['section'])}>
                {title && <h1>Title</h1>}
                <CustomImage media={medias?.get(content.mediaId)} height={400} width={600} />
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
        </SectionWrap>
    )
}

export default ImageBlock
