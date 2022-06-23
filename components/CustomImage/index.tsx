import type { Media } from '@prisma/client'

interface Props {
    img: Media
}

const CustomImage = ({ img, ...props }: Props) => {
    const imageURL = `${process.env.UPLOADS_IMAGES_DIR}/${img.uri}`

    return (
        <>
            <div style={{ backgroundImage: `url(${imageURL})` }} {...props} />
            <noscript>
                <img src={imageURL} alt={img.alt || ''} />
            </noscript>
        </>
    )
}

const Background = ({ img, ...props }: Props) => {
    const imageURL = `${process.env.UPLOADS_IMAGES_DIR}/${img.uri}`

    return <img src={imageURL} alt={img.alt || ''} {...props} />
}

CustomImage.Background = Background

export default CustomImage
