import { ObjectId } from '.'

type PageCreation = {
    name: string
    published: boolean
    slug: string[]
    metadatas: Metadata[]
}

type Metadata = {
    id?: ObjectId
    name: string
    content: string | string[]
}

export default PageCreation
