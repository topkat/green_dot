export function convertNameToObjectId(ressourceName: string) {
    const slug = ressourceName.replace(/[^A-Za-z0-9_]/, '')
    const id = Buffer.from(slug)
        .toString('hex')
        .padStart(24, '0')
    if (id.length > 24) throw new Error('convertNameToObjectId(): id should be lesser than 24 characters when converted to id. Please choose a shorter name for: ' + ressourceName) // DO NOT USE $.throw as it introduce a dependence where this file is not only used in the context of backend
    return id
}