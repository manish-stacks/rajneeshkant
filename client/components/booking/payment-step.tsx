"use client"

import { motion } from "framer-motion"
import { CreditCard, Wallet } from "lucide-react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/* ================= ADD-ON DATA ================= */

const ADD_ONS = [
  {
    id: "abdominal",
    title: "Abdominal Issues",
    desc: "Gas, Acidity, Constipation",
    price: 10000,
  },
  {
    id: "head",
    title: "Head / Face Issues",
    desc: "Migraine, TMJ, Vocal Cord",
    price: 10000,
  },
  {
    id: "pain",
    title: "Pain Care Procedure",
    desc: "Chronic pain injection / therapy",
    price: 20000,
  },
  {
    id: "alignment",
    title: "Full Body Alignment",
    desc: "Upper + Lower + Spine",
    price: 30000,
  },
  {
    id: "muscle",
    title: "Myofascial Muscle Release",
    desc: "Deep muscle therapy",
    price: 2000,
  },
]

/* ================= COMPONENT ================= */

const PaymentStep = () => {
  const BASE_PRICE = 10000

  const [paymentMethod, setPaymentMethod] = useState<"online" | "card">("online")
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const addonsTotal = ADD_ONS
    .filter((a) => selectedAddons.includes(a.id))
    .reduce((sum, a) => sum + a.price, 0)

  const finalAmount = BASE_PRICE + addonsTotal

  /* ================= UI ================= */

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* HEADER */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">
          Payment & Add-On Services
        </h2>
        <p className="text-sm text-slate-600">
          Select optional treatments and choose payment method
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* ADD-ON SERVICES */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add-On Treatments (Optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {ADD_ONS.map((addon) => {
              const checked = selectedAddons.includes(addon.id)
              return (
                <div
                  key={addon.id}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-lg border transition",
                    checked
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 bg-white"
                  )}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggleAddon(addon.id)}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{addon.title}</p>
                    <p className="text-sm text-slate-600">{addon.desc}</p>
                  </div>
                  <div className="font-semibold text-slate-900">
                    ₹{addon.price.toLocaleString()}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* PAYMENT */}
        <Card>

          <CardHeader>
            <CardTitle className="text-lg">Payment Method</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border shadow-sm">
              <span className="text-slate-600 font-medium">Sessions:</span>
              <span className="font-semibold text-slate-900">2 sessions</span>
            </div>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(v) => setPaymentMethod(v as any)}
              className="space-y-3"
            >
              <Label
                htmlFor="online"
                className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer"
              >
                <RadioGroupItem value="online" id="online" />
                <Wallet className="h-5 w-5 text-green-600" />
                <span className="font-medium">Online Payment</span>
              </Label>

              <Label
                htmlFor="card"
                className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer"
              >
                <RadioGroupItem value="card" id="card" />
                <CreditCard className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Credit / Debit Card</span>
              </Label>
            </RadioGroup>

            {/* SUMMARY */}
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Base Consultation</span>
                <span>₹{BASE_PRICE.toLocaleString()}</span>
              </div>

              {addonsTotal > 0 && (
                <div className="flex justify-between">
                  <span>Add-Ons</span>
                  <span>₹{addonsTotal.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between font-semibold text-base border-t pt-2">
                <span>Total</span>
                <span>₹{finalAmount.toLocaleString()}</span>
              </div>
            </div>

            <Button
              className="w-full mt-4 bg-gradient-to-r from-emerald-600 to-teal-600"
            >
              Pay ₹{finalAmount.toLocaleString()}
            </Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

export default PaymentStep
