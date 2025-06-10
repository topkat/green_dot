import { useState } from 'react';
import TerminalDisplay from '../../components/TerminalDisplay';
import { Code } from '@astrojs/starlight/components';
import { PackageManagers } from 'starlight-package-managers';

interface Step {
  id: string
  title: string;
  content: React.ReactNode;
}

export default function Steppers() {
  const [activeStep, setActiveStep] = useState<StepIds>(steps[0].id)

  return (
    <div className="flex flex-col md:flex-row gap-8 mt-8">
      <div className="w-full md:w-1/2 flex flex-col gap-4">
        <TerminalDisplay>
          <b>$ npx green_dot generate</b><br />
          {steps.map(step => {
            const isActive = activeStep === step.id
            return (
              <div
                key={step.id}
                className={`cursor-pointer hover:opacity-80 transition-opacity ${isActive ? 'text-accent-100' : 'text-accent-200'}`}
                onClick={() => setActiveStep(step.id)}
              >
                {isActive
                  ? <b>&nbsp;&nbsp;❯ {step.title}</b>
                  : <>&nbsp;&nbsp;&nbsp;&nbsp;{step.title}</>
                }
              </div>
            )
          })}
        </TerminalDisplay>
      </div>

      {/* Right container with terminal displays */}
      <div className="w-full md:w-1/2">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`content-section ${activeStep === step.id ? '' : 'hidden'}`}
          >
            {step.content}
          </div>
        ))}
      </div>
    </div>
  )
}



const steps = [
  {
    id: 'apiService',
    title: `Api Service`,
    content: <span></span>,
  }, {
    id: 'schedule',
    title: `Scheduled Task`,
    content: <span></span>,
  }, {
    id: 'seed',
    title: `Seed DB Service`,
    content: <span>Seed DB Service</span>,
  }, {
    id: 'dbModel',
    title: `Database Model`,
    content: <span>Database Model</span>,
  }, {
    id: 'testSuite',
    title: `Test Suite`,
    content: <span>Test Suite</span>,
  }, {
    id: 'newDb',
    title: `New Database`,
    content: <span>New Database</span>,
  }, {
    id: 'newBackend',
    title: `New Backend App`,
    content: <span>New Backend App</span>,
  }, {
    id: 'newFront',
    title: `New Frontend`,
    content: <span>New Frontend</span>,
  }
] as const satisfies Step[]

type StepIds = typeof steps[number]['id']