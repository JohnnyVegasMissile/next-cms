import { CodeLanguage } from '@prisma/client'
import { PagesDisplays } from '~/components/PagesDisplays'

const HomeESSide = async () => <PagesDisplays.Page lang={CodeLanguage.ES} slug={['es']} sidebar />

export default HomeESSide
