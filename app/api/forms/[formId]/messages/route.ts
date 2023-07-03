import { FormFieldType } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from '~/types'

export const POST = async (request: NextRequest, context: any) => {
    const { formId } = context.params
    const message = (await request.json()) as { [key in string]: string | number | string[] | boolean }

    const data: {
        formFieldId: ObjectId
        valueText?: string
        valueNumber?: number
        valueBoolean?: boolean
        valueMultiple?: string[] | number[]
    }[] = []

    const keys = Object.keys(message)

    for (const key of keys) {
        const formField = await prisma?.formField.findUnique({ where: { id: key } })

        switch (formField?.type) {
            case FormFieldType.TEXT:
            case FormFieldType.EMAIL:
            case FormFieldType.PASSWORD:
            case FormFieldType.PARAGRAPH:
            case FormFieldType.OPTION:
            case FormFieldType.RADIO:
            case FormFieldType.CONTENT:
                data.push({
                    formFieldId: key,
                    valueText: message[key] as string,
                })
                break

            case FormFieldType.MULTICHECKBOX:
                data.push({
                    formFieldId: key,
                    valueMultiple: message[key] as any[],
                })
                break

            case FormFieldType.NUMBER:
                data.push({
                    formFieldId: key,
                    valueNumber: message[key] as number,
                })
                break

            case FormFieldType.CHECKBOX:
                data.push({
                    formFieldId: key,
                    valueBoolean: message[key] as boolean,
                })
                break

            default:
                break
        }
    }

    await prisma?.message.create({
        data: {
            formId,
            fields: {
                createMany: { data },
            },
        },
    })

    return NextResponse.json({ success: true }, { status: 200 })
}
