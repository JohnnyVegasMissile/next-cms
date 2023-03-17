import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import styles from './ImageBlock.module.scss'
import { BlockDetails, ViewBlockProps } from '..'
import useSection from '~/hooks/useSection'
import SectionWrap from '~/components/SectionWrap'
import MediaModal from '~/components/MediaModal'
import { MediaType } from '@prisma/client'
import CustomImage from '~/components/CustomImage'

const ImageBlock = ({ position }: ViewBlockProps) => {
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

const Details: BlockDetails = {
    View: ImageBlock,
    Edit: ImageBlock,
    title: 'Text',
    position: ['HEADER', 'FOOTER', 'SIDEBAR', 'CONTENT'],
    availableIn: ['LAYOUT', 'PAGE', 'CONTAINER', 'TEMPLATE', 'CONTENT', 'ELEMENT'],
    default: { title: 'Title', image: 1 },
}

export default Details
