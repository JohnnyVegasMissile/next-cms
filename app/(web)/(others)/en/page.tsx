import { CodeLanguage } from '@prisma/client'
import OthersPage from '../../OthersPage'

const HomeEn = async () => <OthersPage homepage lang={CodeLanguage.EN} slug={['en']} />

export const revalidate = Infinity

export default HomeEn
