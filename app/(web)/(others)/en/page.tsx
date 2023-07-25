import { CodeLanguage } from '@prisma/client'
import { PagesDisplays } from '~/components/PagesDisplays'

const HomeEn = async () => <PagesDisplays.Page homepage lang={CodeLanguage.EN} slug={['en']} />

export const revalidate = Infinity

export default HomeEn
