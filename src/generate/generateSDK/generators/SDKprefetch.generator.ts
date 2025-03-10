



export function SDKprefetchGenerator(
  queryName: string,
  tsTypes: string[],
  objectTs: Record<string, string>
) {
  //----------------------------------------
  // EXPOSE REACT QUERY PREFETCH TS
  //----------------------------------------
  const prefetchTypes = []
  for (const tsType of tsTypes) {
    const paramFunctionBits = tsType
      .replace('(', `(\n${' '.repeat(8)}queryOptions?: Partial<Omit<FetchQueryOptions, 'queryFn'>>,`) // add queryOptions first param
      .replace(/FetchQueryOptions,([^ ])/, 'FetchQueryOptions, $1') // formatter happy
      .replace(/\) *:/, '%%%') // prepare splitting return type
      .split('%%%')
    paramFunctionBits.pop() // remove return type
    const finlType2 = paramFunctionBits
      .map(fnb => fnb.replace(/\n/g, '\n    ')) // add correct indentation
      .join('):') +
      '): Promise<void>'
    prefetchTypes.push(finlType2)
  }
  objectTs['prefetch.' + queryName] = prefetchTypes.join(`\n        ${queryName}`)
}