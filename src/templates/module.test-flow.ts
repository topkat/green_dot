/* SYNOPSIS

*/



import { TestFlow } from '../../1_shared/configs/rest-test-config'
import { assert } from 'rest-test2'
import { $ } from '@bangk/ico-dashboard-sdk'
import { TestEnv } from '../../1_shared/tests/testEnv.type'

const testFlow = {
    name: 'myNewModule test flow',
    items: [

    ]
} satisfies TestFlow<TestEnv & {/* replace by custom env type */ }>

export default testFlow