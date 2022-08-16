import { Slug } from '@prisma/client'
import { AutoComplete, Typography } from 'antd'
// import { useQuery, UseQueryResult } from 'react-query'
// import { getContainers } from '../../network/containers'
import { getSlugs } from '../../network/api'
// import type { Container } from '@prisma/client'
// import { useMemo } from 'react'
// import { FullArticle } from 'types'
import get from 'lodash.get'
import { useQuery, UseQueryResult } from 'react-query'
import { useMemo } from 'react'
import { SizeType } from 'antd/lib/config-provider/SizeContext'

const { Text } = Typography

interface Props {
    value: string
    width?: number | `${string}%`
    onChange: (value: string) => void
    size?: SizeType
    onBlur?: () => void
    onPressEnter?: () => void
    placeholder?: string
}

const LinkInput = ({ value, onChange, width = 300, ...rest }: Props) => {
    const slugs: UseQueryResult<Slug[], Error> = useQuery<Slug[], Error>(['slugs'], () => getSlugs(), {
        refetchOnMount: false,
    })

    const options = useMemo(() => {
        const pagesOptions =
            slugs?.data?.map((slug: any) => ({
                value: `/${slug.fullSlug}`,
                searchLabel: slug?.content?.title || slug?.container?.title,
                label: (
                    <>
                        <Text>{slug?.content?.title || slug?.container?.title}</Text>
                        <Text type="secondary">{` (/${slug.fullSlug})`}</Text>
                    </>
                ),
            })) || []

        return [...pagesOptions]
    }, [slugs])

    const isError = !!value && get(value, '0', '') !== '/' ? 'error' : ''

    return (
        <AutoComplete
            {...rest}
            status={isError}
            value={value}
            options={options}
            style={{ width }}
            onSelect={(value: string) => onChange(value)}
            onChange={onChange}
            allowClear
            // filterOption={(inputValue, option) =>
            //     option!.searchLabel.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            // }
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
