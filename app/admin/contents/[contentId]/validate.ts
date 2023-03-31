import { Dayjs } from 'dayjs'
import { slugExist } from '~/network/slugs'
import ContentCreation from '~/types/contentCreation'

const validate = async (values: ContentCreation<Dayjs>) => {
    const errors: any = {}

    const res = await slugExist(values.slug, values.id ? { contentId: values.id } : undefined)

    if (res.exist) {
        errors.slug = 'Slug already exist'
    }

    return errors
}

export default validate
