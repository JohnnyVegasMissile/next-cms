import {} from 'react'
import type { Media } from '@prisma/client'

interface Props {
    img?: Media
    className: string
}

const CustomImage = ({ img, className }: Props) => {
    const imageURL = `${process.env.UPLOADS_IMAGES_DIR}/${img?.uri}`

    return (
        <>
            <div style={{ backgroundImage: `url(${imageURL})` }} className={className} />
            <noscript>
                <img src={imageURL} alt={img?.alt || ''} />
            </noscript>
        </>
    )
}

const Background = ({ img, className }: Props) => {
    const imageURL = `${process.env.UPLOADS_IMAGES_DIR}/${img?.uri}`

    return <img src={imageURL} alt={img?.alt || ''} className={className} />
}

CustomImage.Background = Background

export default CustomImage
