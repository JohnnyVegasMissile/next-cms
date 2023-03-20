import { Editor, EditorState, RichUtils } from 'draft-js'
import 'draft-js/dist/Draft.css'
import { CSSProperties, useEffect, useState } from 'react'
import { convertFromHTML, convertToHTML } from 'draft-convert'

interface StyledInputProps {
    value: string
    onChange(value: string): void
    boldStyle?: CSSProperties
    italicStyle?: CSSProperties
    underlineStyle?: CSSProperties
    strikethroughStyle?: CSSProperties
    noBreak?: boolean
}

const StyledInput = ({
    value,
    onChange,
    boldStyle,
    italicStyle,
    underlineStyle,
    strikethroughStyle,
    noBreak,
}: StyledInputProps) => {
    const [isFocus, setIsFocus] = useState(false)
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty())

    const styleMap = {
        BOLD: {
            // all: 'inherit',
            fontWeight: 'bold',
            ...boldStyle,
        },
        ITALIC: {
            // all: 'inherit',
            fontStyle: 'italic',
            ...italicStyle,
        },
        UNDERLINE: {
            // all: 'inherit',
            textDecoration: 'underline',
            ...underlineStyle,
        },
        STRIKETHROUGH: {
            // all: 'inherit',
            textDecoration: 'line-through',
            ...strikethroughStyle,
        },
    }

    const handleKeyCommand = (command: string, editorState: EditorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command)

        if (newState) {
            setEditorState(newState)
            return 'handled'
        }

        return 'not-handled'
    }

    useEffect(() => {
        if (!isFocus) resetContent()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    const resetContent = () => {
        const contentState = convertFromHTML({
            htmlToEntity: (nodeName, _, createEntity) => {
                if (nodeName === 'br') {
                    return createEntity('PARAGRAPH', 'MUTABLE', {})
                }
                return
            },
        })(value || '')

        setEditorState(EditorState.createWithContent(contentState))
    }

    const handleOnChange = (e: EditorState) => {
        const lastAction = e.getLastChangeType()
        if (!!noBreak && lastAction === 'split-block') return

        setEditorState(e)

        const html = convertToHTML({
            blockToHTML: (block) => {
                if (block.type === 'unstyled' && !block.text) {
                    return <br />
                }
                return
            },
        })(e.getCurrentContent())

        onChange(html)
    }

    return (
        <Editor
            onBlur={() => {
                setIsFocus(false)
                resetContent()
            }}
            onFocus={() => setIsFocus(true)}
            customStyleMap={styleMap}
            editorState={editorState}
            onChange={handleOnChange}
            handleKeyCommand={handleKeyCommand}
            placeholder="cdlsd"
        />
    )
}

export default StyledInput
