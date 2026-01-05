'use client'
import React from 'react'
import { useState } from 'react'
import  LocationStep  from '@/components/booking/location-step'
import PatientDetailsStep from '@/components/booking/patient-details-step'
import  PaymentStep  from '@/components/booking/payment-step'
import ProgressBar from '@/components/booking/progress-bar'
import  ScheduleStep  from '@/components/booking/schedule-step'
import ServiceStep from '@/components/booking/service-step'

const TOTAL_STEPS = 5

export default function BookNowConsultations() {
  const [currentStep, setCurrentStep] = useState(1)

  const next = () => currentStep < TOTAL_STEPS && setCurrentStep(s => s + 1)
  const prev = () => currentStep > 1 && setCurrentStep(s => s - 1)

  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <ProgressBar currentStep={currentStep} />

        {currentStep === 1 && <PatientDetailsStep />}
        {currentStep === 2 && <ServiceStep />}
        {currentStep === 3 && <LocationStep />}
        {currentStep === 4 && <ScheduleStep />}
        {currentStep === 5 && <PaymentStep />}

        <div className="flex justify-between mt-8">
          <button
            onClick={prev}
            disabled={currentStep === 1}
            className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
          >
            Previous
          </button>

          <button
            onClick={next}
            disabled={currentStep === TOTAL_STEPS}
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
