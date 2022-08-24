const getNameFieldFromType = (type: string) => {
    let valueName = 'textValue'

    switch (type) {
        case 'string':
        case 'text':
        case 'link':
            valueName = 'textValue'
            break
        case 'number':
            valueName = 'numberValue'
            break
        case 'boolean':
            valueName = 'boolValue'
            break
        case 'date':
            valueName = 'dateValue'
            break
        case 'image':
        case 'file':
            valueName = 'media'
        case 'content':
            valueName = 'contentValueId'
            break
    }

    return valueName
}

export default getNameFieldFromType
