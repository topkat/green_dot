/* SYNOPSIS

*/



import { TestSuite } from '../../1_shared/configs/rest-test-config'
import { assert } from 'rest-test2'
import { $ } from '@bangk/ico-dashboard-sdk'
import { TestEnv } from '../../1_shared/tests/testEnv.type'

const testSuite = {
    name: 'myNewModule test suite',
    items: [

    ]
} satisfies TestSuite<TestEnv & {/* replace by custom env type */ }>

export default testSuite