const Display = ({ children, className }: { children: string; className: string | undefined }) => {
    return <div className={className} dangerouslySetInnerHTML={{ __html: children }} />
}

export default Display
