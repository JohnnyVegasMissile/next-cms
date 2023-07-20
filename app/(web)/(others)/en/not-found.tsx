import { CodeLanguage } from '@prisma/client'
import OthersNotFound from '../../OthersNotFound'

const NotFoundEn = async () => <OthersNotFound lang={CodeLanguage.EN} />

export const revalidate = Infinity

export default NotFoundEn
