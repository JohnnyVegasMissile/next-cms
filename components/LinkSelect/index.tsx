import { Input, Select, Space, TreeSelect } from 'antd'
import {
    LinkOutlined,
    GlobalOutlined,
    HomeOutlined,
    LoginOutlined,
    FileOutlined,
    ContainerOutlined,
    BookOutlined,
} from '@ant-design/icons'
// import './styles.scss'
import { useQuery } from '@tanstack/react-query'
import { getSlugsSimple } from '~/network/slugs'
import { ObjectId } from '~/types'
import { LinkType, LinkProtocol, PageType } from '@prisma/client'
import styles from './LinkSelect.module.scss'

const { Option } = Select

interface Option {
    value: string | number
    label: string
    children?: Option[]
}

export type LinkValue =
    | {
          type: typeof LinkType.IN
          slugId?: ObjectId | undefined

          link?: never
          prototol?: never
      }
    | {
          type: typeof LinkType.OUT
          link?: string | undefined
          prototol?: LinkProtocol | undefined

          slugId?: never
      }

interface LinkSelectProps {
    value: LinkValue
    onChange(value: LinkValue): void
    error?: boolean
}

const LinkSelect = ({ value, onChange, error }: LinkSelectProps) => {
    // const [q, setQ] = useState('')
    const slugs = useQuery(['slugs-simple'], () => getSlugsSimple(), { enabled: value.type === LinkType.IN })

    const options = slugs.data?.map((slug) => ({
        value: slug.id,
        label: !!slug.page ? (
            <Space>
                <FileOutlined />
                {slug.page?.name}
            </Space>
        ) : (
            <Space>
                <ContainerOutlined />
                {slug.container?.name}
            </Space>
        ),
        children: slug.childs.map((child) => ({
            value: child.id,
            label: (
                <Space>
                    <BookOutlined />
                    {child.content?.name}
                </Space>
            ),
        })),
    }))

    const onPageChange = (slugId: ObjectId | undefined) =>
        value.type === LinkType.IN && onChange({ ...value, slugId })

    const onTypeChange = (type: LinkType) => {
        if (type === LinkType.IN) {
            onChange({
                type: LinkType.IN,
                slugId: undefined,
            })
        } else {
            onChange({
                type: LinkType.OUT,
                link: undefined,
                prototol: LinkProtocol.HTTPS,
            })
        }
    }

    const onProtocolChange = (prototol: LinkProtocol) =>
        value.type === LinkType.OUT &&
        onChange({
            ...value,
            prototol,
        })

    const onLinkChange = (link: string) => value.type === 'OUT' && onChange({ ...value, link })

    const selectBefore = (
        <Select
            value={value.prototol}
            onChange={onProtocolChange}
            size="small"
            className={styles['protocol']}
            // style={{ minWidth: 83, textAlign: 'left' }}
        >
            <Option value={LinkProtocol.HTTP}>http://</Option>
            <Option value={LinkProtocol.HTTPS}>https://</Option>
        </Select>
    )

    return (
        <Space.Compact size="small" className={styles['link-select']}>
            {value.type === 'IN' ? (
                <TreeSelect
                    treeLine
                    // showSearch
                    status={error ? 'error' : undefined}
                    size="small"
                    placeholder="Please select"
                    value={value.slugId}
                    className={styles['tree']}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    allowClear
                    onChange={onPageChange}
                    treeData={[
                        {
                            value: PageType.HOMEPAGE,
                            label: (
                                <Space>
                                    <HomeOutlined />
                                    Homepage
                                </Space>
                            ),
                        },
                        {
                            value: PageType.SIGNIN,
                            label: (
                                <Space>
                                    <LoginOutlined />
                                    Sign In
                                </Space>
                            ),
                        },
                        ...(options || []),
                    ]}
                    autoClearSearchValue={false}
                    // searchValue={q}
                    // onSearch={setQ}
                />
            ) : (
                <Input
                    value={value.link}
                    status={error ? 'error' : undefined}
                    onChange={(e) => onLinkChange(e.target.value)}
                    addonBefore={selectBefore}
                    size="small"
                    className={styles['input']}
                    placeholder="Please select"
                    allowClear
                />
            )}
            <Select
                status={error ? 'error' : undefined}
                size="small"
                value={value.type}
                onChange={onTypeChange}
            >
                <Option value={LinkType.IN}>
                    <div className={styles['icon']}>
                        <LinkOutlined />
                    </div>
                </Option>
                <Option value={LinkType.OUT}>
                    <div className={styles['icon']}>
                        <GlobalOutlined />
                    </div>
                </Option>
            </Select>
        </Space.Compact>
    )
}

export default LinkSelect
