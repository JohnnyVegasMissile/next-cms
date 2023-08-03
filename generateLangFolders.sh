arr=( "AF" "SQ" "AR" "EU" "BE" "BG" "CA" "ZH" "HR" "CS" "DA" "NL" "EN" "ET" "FO" "FA" "FI" "FR" "GD" "DE" "EL" "HE" "HI" "HU" "IS" "ID" "GA" "IT" "JA" "KO" "KU" "LV" "LT" "MK" "ML" "MS" "MT" "NO" "NB" "NN" "PL" "PT" "PA" "RM" "RO" "RU" "SR" "SK" "SL" "SB" "ES" "SV" "TH" "TS" "TN" "TR" "UA" "UR" "VE" "VI" "CY" "XH" "JI" "ZU" )

path="app/(web)/(others)/"

rm -rfv $path*

touch $path/not-found.tsx

echo "import { PagesDisplays } from '~/components/PagesDisplays'

const NotFoundAll = async () => <PagesDisplays.NotFound />

export const revalidate = Infinity

export default NotFoundAll" > $path$lowerCodeLang/not-found.tsx

for codeLang in "${arr[@]}"
do
    lowerCodeLang=$(echo $codeLang | tr '[:upper:]' '[:lower:]')

    mkdir -p $path$lowerCodeLang
    touch $path$lowerCodeLang/layout.tsx

    echo "import { ReactNode } from 'react'
import { CodeLanguage } from '@prisma/client'
import { PagesDisplays } from '~/components/PagesDisplays'

const Layout$codeLang = async ({ children }: { children: ReactNode }) => (
    <PagesDisplays.Layout lang={CodeLanguage.$codeLang} content={children} />
)

export const revalidate = Infinity

export default Layout$codeLang" > $path$lowerCodeLang/layout.tsx

    touch $path$lowerCodeLang/not-found.tsx

    echo "import { CodeLanguage } from '@prisma/client'
import { PagesDisplays } from '~/components/PagesDisplays'

const NotFound$codeLang = async () => <PagesDisplays.NotFound lang={CodeLanguage.$codeLang} />

export const revalidate = Infinity

export default NotFound$codeLang" > $path$lowerCodeLang/not-found.tsx

    touch $path$lowerCodeLang/page.tsx

    echo "import { CodeLanguage } from '@prisma/client'
import { PagesDisplays, generateMetadata as getMetas } from '~/components/PagesDisplays'

export const generateMetadata = async () => getMetas('', CodeLanguage.$codeLang)

const Home$codeLang = async () => <PagesDisplays.Page homepage lang={CodeLanguage.$codeLang} />

export const revalidate = Infinity

export default Home$codeLang" > $path$lowerCodeLang/page.tsx

    mkdir -p $path$lowerCodeLang/[...slug]
    touch $path$lowerCodeLang/[...slug]/page.tsx

    echo "import { CodeLanguage } from '@prisma/client'
import { PagesDisplays, generateMetadata as getMetas } from '~/components/PagesDisplays'

export const generateMetadata = async ({ params }: { params: { slug: string } }) =>
    getMetas(Array.isArray(params.slug) ? params.slug.join('/') : params.slug, CodeLanguage.$codeLang)

const Slug$codeLang = async ({ params }: { params: { slug: string[] } }) => (
    <PagesDisplays.Page lang={CodeLanguage.$codeLang} slug={params.slug} />
)

export const revalidate = Infinity

export default Slug$codeLang" > $path$lowerCodeLang/[...slug]/page.tsx

    mkdir -p $path$lowerCodeLang/@sidebar
    touch $path$lowerCodeLang/@sidebar/page.tsx

    echo "import { CodeLanguage } from '@prisma/client'
import { PagesDisplays } from '~/components/PagesDisplays'

const Home$codeLang = async () => <PagesDisplays.Page lang={CodeLanguage.$codeLang} sidebar />

export default Home$codeLang" > $path$lowerCodeLang/@sidebar/page.tsx

    mkdir -p $path$lowerCodeLang/@sidebar/[...slug]
    touch $path$lowerCodeLang/@sidebar/[...slug]/page.tsx

    echo "import { CodeLanguage } from '@prisma/client'
import { PagesDisplays } from '~/components/PagesDisplays'

const Slug$codeLang = async ({ params }: { params: { slug: string[] } }) => (
    <PagesDisplays.Page lang={CodeLanguage.$codeLang} slug={params.slug} sidebar />
)

export default Slug$codeLang" > $path$lowerCodeLang/@sidebar/[...slug]/page.tsx

done
