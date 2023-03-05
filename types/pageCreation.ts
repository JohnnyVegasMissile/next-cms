import { ObjectId } from '.'

type PageCreation = {
    name: string
    published: boolean
    slug: string[]
    metadatas: Metadata[]
}

type Metadata = {
    id?: ObjectId
    name: 'description' | 'keywords' | 'author' | 'viewport' | string
    content: string | string[]
}

export default PageCreation
