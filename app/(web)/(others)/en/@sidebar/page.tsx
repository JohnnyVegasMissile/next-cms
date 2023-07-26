import { CodeLanguage } from '@prisma/client'
import { PagesDisplays } from '~/components/PagesDisplays'

const HomeENSide = async () => <PagesDisplays.Page lang={CodeLanguage.EN} slug={['en']} sidebar />

export default HomeENSide
