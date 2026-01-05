'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function PatientDetailsStep() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Patient Details</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Full Name</Label>
          <Input placeholder="Enter full name" />
        </div>

        <div>
          <Label>Mobile Number</Label>
          <Input placeholder="10 digit mobile number" />
        </div>

        <div>
          <Label>Email (optional)</Label>
          <Input placeholder="Email address" />
        </div>

        <div>
          <Label>Aadhaar Number</Label>
          <Input placeholder="XXXX-XXXX-1234" />
        </div>
      </div>
    </div>
  )
}
