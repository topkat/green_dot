



export function SDKdeferGenerator(
  queryName: string,
  tsTypes: string[],
  objectTs: Record<string, string>
) {

  objectTs['defer__COMMENT__'] ??= `/** DEFER is used to avoid many user actions to trigger a lot of api calls. When a user do a modification (Eg: check a checkbox) we send a deferred call that will send the api call in 3 seconds. If between this time the user reclick the checkbox, it will cancel the first call and wait 3 seconds again so that in the end only one call is triggered. */`

  //----------------------------------------
  // DEFER TS
  //----------------------------------------
  const deferTypes = []
  for (const tsType of tsTypes) {
    deferTypes.push(tsType.replace(/\) *:(.*)$/, '): void'))
  }
  objectTs['defer.' + queryName] = deferTypes.join(`\n        ${queryName}`)


}