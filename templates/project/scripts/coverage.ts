

import { execWaitForOutput } from 'topkat-utils/backend'
import { ChildProcess } from 'child_process'
import request from 'request'

import { C, timeout } from 'topkat-utils'

const config = {
  runUnitTests: true,
  runApiTests: true,
}

async function runScript() {
  try {

    let backProcess: ChildProcess

    //----------------------------------------
    // UNIT TESTS
    //----------------------------------------
    if (config.runUnitTests) {
      C.info('====> START UNIT TESTS <=====')

      await execWaitForOutput(
        'jest --ci --runInBand --maxConcurrency=1 --silent',
        {
          nbSecondsBeforeKillingProcess: 300,
          errorHandle: 'error',
        }
      )
    }

    //----------------------------------------
    // START BACKEND ASYNC
    //----------------------------------------
    if (config.runApiTests) {
      await timeout(1000) // wait for coverage
      C.info('====> START BACKEND <=====')
      await timeout(1000)


      execWaitForOutput(
        'nyc npm run start:backend-ci', // --no-clean 
        {
          nbSecondsBeforeKillingProcess: 300,
          errorHandle: 'log',
          onStartProcess: process => {
            backProcess = process
          },
        }
      )

      //----------------------------------------
      // START API TESTS
      //----------------------------------------
      await timeout(3000)
      C.info('====> START API TESTS <=====')
      await timeout(12000)

      await execWaitForOutput(
        'cd ./apps/backend && npm run test:api-ci',
        {
          nbSecondsBeforeKillingProcess: 300,
          stringOrRegexpToSearchForConsideringDone: '%%END%%',
          errorHandle: 'error',
        }
      )

      C.info('STOP BACKEND PROCESS')

      await new Promise((resolve, reject) => {
        request('http://localhost:9086/killProcess', err => { // (err, resp, body)
          if (err?.code === 'ECONNRESET') {
            C.success('Backend Server ended gracefully')
            resolve(true)
          } else if (err) {
            reject('ERROR while killing server process, check the server is in "test" env')
          }
        })
      })
    }


    //----------------------------------------
    // COVERAGE REPORT
    //----------------------------------------
    await timeout(1000)
    C.info('====> GENERATING COVERAGE REPORT <=====')
    await timeout(1000)

    await execWaitForOutput(`istanbul-merge --out coverage.json ./coverage/coverage-final.json ./coverage-jest/coverage-final.json`)
    await execWaitForOutput(`istanbul report --include coverage.json html`)


    //----------------------------------------
    // CLEANUP
    //----------------------------------------
    C.info('====> CLEANUP FILES <=====')
    await execWaitForOutput('rm -rf ./coverage-jest')
    await execWaitForOutput('rm ./coverage.json')

    C.log(`open "file:///$PWD/coverage/index.html"`)

    process.exit(0)

  } catch (err) {
    C.error(err)
    process.exit(1)
  }
}

runScript()