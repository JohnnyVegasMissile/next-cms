import { AutoComplete, Typography } from 'antd'
import { useQuery, UseQueryResult } from 'react-query'
import { getContainers } from '../../network/containers'
import { getArticles } from '../../network/articles'
import type { Container } from '@prisma/client'
import { useMemo } from 'react'
// import { FullArticle } from 'types'
import get from 'lodash.get'

const { Text } = Typography

interface Props {
    value: string
    width?: number | `${string}%`
    onChange: (value: string) => void
}

const LinkInput = ({ value, onChange, width = 300 }: Props) => {
    const pages: UseQueryResult<Container[], Error> = useQuery<Container[], Error>(
        ['containers'],
        () => getContainers(),
        {
            // select: (data) => data.filter((e) => e.type !== 'error'),
            refetchOnMount: false,
        }
    )

    // const articles: UseQueryResult<FullArticle[], Error> = useQuery<FullArticle[], Error>(
    //     ['acticles'],
    //     () => getArticles(),
    //     {
    //         refetchOnMount: false,
    //     }
    // )

    const options = useMemo(() => {
        const pagesOptions =
            pages?.data?.map((page) => ({
                value: `/${page.slug}`,
                searchLabel: page.title,
                label: (
                    <>
                        <Text>{page.title}</Text>
                        <Text type="secondary">{` (Page)`}</Text>
                    </>
                ),
            })) || []
        // const articlesOptions =
        //     articles?.data?.map((article) => ({
        //         value: `/${article.page.slug}/${article.slug}`,
        //         searchLabel: `${article.title} ${article.page.title}`,
        //         label: (
        //             <>
        //                 <Text>{article.title}</Text>
        //                 <Text type="secondary">{` (${article.page.title} article)`}</Text>
        //             </>
        //         ),
        //     })) || []

        return [...pagesOptions]
    }, [pages])

    const isError = !!value && get(value, '0', '') !== '/' ? 'error' : ''

    return (
        <AutoComplete
            status={isError}
            value={value}
            options={options}
            style={{ width }}
            onSelect={(value: string) => onChange(value)}
            onChange={onChange}
            allowClear
            filterOption={(inputValue, option) =>
                option!.searchLabel.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
        />
    )
}

// import { Cascader } from 'antd'
// import type { DefaultOptionType } from 'antd/es/cascader'
// import React from 'react'

// interface Option {
//     value: string
//     label: string
//     children?: Option[]
//     disabled?: boolean
// }

// const options: Option[] = [
//     {
//         value: 'zhejiang',
//         label: 'Zhejiang',
//         children: [
//             {
//                 value: 'hangzhou',
//                 label: 'Hangzhou',
//                 children: [
//                     {
//                         value: 'xihu',
//                         label: 'West Lake',
//                     },
//                     {
//                         value: 'xiasha',
//                         label: 'Xia Sha',
//                         disabled: true,
//                     },
//                 ],
//             },
//         ],
//     },
//     {
//         value: 'jiangsu',
//         label: 'Jiangsu',
//         children: [
//             {
//                 value: 'nanjing',
//                 label: 'Nanjing',
//                 children: [
//                     {
//                         value: 'zhonghuamen',
//                         label: 'Zhong Hua men',
//                     },
//                 ],
//             },
//         ],
//     },
// ]

// const onChange = (value: string[], selectedOptions: Option[]) => {
//     console.log(value, selectedOptions)
// }

// const filter = (inputValue: string, path: DefaultOptionType[]) =>
//     path.some((option) => (option.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) > -1)

// const App: React.FC = () => (
//     <Cascader
//         options={options}
//         onChange={onChange}
//         placeholder="Please select"
//         showSearch={{ filter }}
//         onSearch={(value) => console.log(value)}
//     />
// )

export default LinkInput
