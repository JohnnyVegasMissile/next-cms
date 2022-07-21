import { useState, useEffect } from 'react'
import styles from './Banner.module.css'

import type { Props } from '../types'
import CustomImage from '../../components/CustomImage'
import { Button, Card, Space, Switch } from 'antd'
import StyledInput from '../../components/StyledInput'
import get from 'lodash.get'
import set from 'lodash.set'
import { PlusOutlined } from '@ant-design/icons'
import MediaModal from '../../components/MediaModal'
import LinkInput from '../../components/LinkInput'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'

const parseDefaultValue = (values: string) => {
    try {
        return JSON.parse(values)
    } catch (e) {
        return {}
    }
}

const Edit = ({ defaultValues, onChange }: Props) => {
    const [values, setValues] = useState<any>(parseDefaultValue(defaultValues))
    const [page, setPage] = useState<number>(0)

    useEffect(() => {
        if (values?.list?.length === 0) {
            setValues({ ...values, list: [{}] })
        }
    }, [])

    const handleChange = (name: string, value: any) => {
        const newValue = { ...values }

        set(newValue, name, value)

        setValues(newValue)

        try {
            if (onChange) onChange(JSON.stringify(newValue))
        } catch (e) {
            console.log('Error on edit')
        }
    }

    return (
        <EditPanel
            view={
                // <div className={styles.container}>
                // <div className={styles.wrapperUnfixed}>
                //     <nav className={styles.nav}>
                //         {get(values, 'list', []).map((e: any, idx: number) => (
                //             <Fragment key={idx}>
                //                 <StyledInput.a
                //                     className={styles.link}
                //                     value={e.label}
                //                     onChange={(e) => handleChange(`list.${idx}.label`, e)}
                //                 />
                //                 <Button
                //                     size="small"
                //                     type="primary"
                //                     danger
                //                     shape="circle"
                //                     icon={<CloseOutlined />}
                //                 />
                //             </Fragment>
                //         ))}
                //         <Button
                //             onClick={() =>
                //                 handleChange(`list.${get(values, 'list', []).length}`, {})
                //             }
                //             size="small"
                //             type="primary"
                //             shape="circle"
                //             icon={<PlusOutlined />}
                //         />
                //     </nav>
                //     {/* </div> */}
                // </div>
                <div style={{ width: '100%' }}>
                    <section style={{ maxWidth: '80vw' }}>
                        <Swiper
                            // install Swiper modules
                            modules={[Navigation]}
                            // spaceBetween={50}
                            // slidesPerView={3}
                            draggable={false}
                            navigation
                            pagination={{ clickable: true }}
                            // scrollbar={{ draggable: false }}
                            // loop
                            onSwiper={(r) => console.log('1', r)}
                            onSlideChange={(p) => setPage(p.activeIndex)}
                        >
                            {get(values, 'list', []).map((e: any, idx: number) => (
                                <SwiperSlide key={idx}>
                                    <CustomImage.Background
                                        img={get(e, 'img', undefined)}
                                        className={styles.background}
                                    >
                                        <div className={styles.layer}>
                                            <StyledInput.h1
                                                className={styles.title}
                                                value={e.label}
                                                onChange={(e) =>
                                                    handleChange(`list.${idx}.label`, e)
                                                }
                                            />

                                            {e.hasButton && (
                                                <StyledInput.button
                                                    className={styles.button}
                                                    value={e.button?.label}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            `list.${idx}.button.label`,
                                                            e
                                                        )
                                                    }
                                                />
                                            )}
                                        </div>
                                    </CustomImage.Background>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </section>
                </div>
            }
            panel={
                <Space direction="vertical" style={{ width: '100%' }}>
                    {page}
                    <Button
                        onClick={() =>
                            handleChange(`list.${get(values, 'list', []).length}`, {})
                        }
                        size="small"
                        type="primary"
                        shape="circle"
                        icon={<PlusOutlined />}
                    />
                    <MediaModal
                        value={get(values, `list.${page}.img`, undefined)}
                        onMediaSelected={(e) => handleChange(`list.${page}.img`, e)}
                    />
                    <Switch
                        checked={get(values, `list.${page}.hasButton`, false)}
                        onChange={(checked: boolean) =>
                            handleChange(`list.${page}.hasButton`, checked)
                        }
                    />
                    {get(values, `list.${page}.hasButton`, false) && (
                        <LinkInput
                            value={get(values, `list.${page}.button.link`, undefined)}
                            onChange={() =>
                                handleChange(`list.${page}.button.link`, undefined)
                            }
                            width="100%"
                        />
                    )}
                    {/* {get(values, 'list', []).map((e: any, idx: number) => (
                            <Fragment key={idx}>
                                <span>{e.label}</span>
                                <LinkInput
                                    value={get(e, 'link', '')}
                                    onChange={(e) => handleChange(`list.${idx}.link`, e)}
                                />
                            </Fragment>
                        ))} */}
                </Space>
            }
        />
    )
}

interface PanelProps {
    view: JSX.Element
    panel?: JSX.Element
}

const EditPanel = ({ view, panel }: PanelProps) => (
    <div style={{ display: 'flex' }}>
        <div style={{ flex: 5, backgroundColor: 'rgb(240, 242, 245)' }}>{view}</div>
        {!!panel && (
            <Card title="Settings Panel" style={{ flex: 1, marginTop: 1 }} bordered={false}>
                {panel}
            </Card>
        )}
    </div>
)

export default Edit
