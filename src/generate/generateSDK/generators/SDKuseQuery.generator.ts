



export function SDKuseQueryGenerator(
  queryName: string,
  tsTypes: string[],
  objectTs: Record<string, string>
) {
  //----------------------------------------
  // USE REACT QUERY TS
  //----------------------------------------
  const queryTypeStrs = []
  for (const tsType of tsTypes) {
    const queryFunctionBits = tsType.replace(/\) *:/, '%%%').split('%%%')

    const returnTypeWithoutPromise = queryFunctionBits.pop().replace(/\s*Promise</, '').replace(/>?\s*$/, '').trim()
    const useQueryReturnType = `[
            ${returnTypeWithoutPromise},
            Omit<ReturnType<typeof useSuspenseQuery>, 'data'>
        ]`

    queryFunctionBits[0] = queryFunctionBits[0]
      .replace('(', `(\n${' '.repeat(8)}queryOptions?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,`) // add queryOptions first param

    const finalType = [
      ...queryFunctionBits.map(fnb => fnb.replace(/\n/g, '\n    ')),
      useQueryReturnType
    ].join('):')
    queryTypeStrs.push(finalType)
  }
  objectTs['useQuery.' + queryName] = queryTypeStrs.join(`\n        ${queryName}`)
}