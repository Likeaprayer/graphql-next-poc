"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { updateDepartment } from "@/lib/api"
import type { Department } from "@/lib/types"

interface UpdateDepartmentDialogProps {
  department: Department
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export default function UpdateDepartmentDialog({
  department,
  open,
  onOpenChange,
  onSuccess,
}: UpdateDepartmentDialogProps) {
  const [departmentName, setDepartmentName] = useState(department.name)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleClose = () => {
    setDepartmentName(department.name)
    setError("")
    onOpenChange(false)
  }

  const validateForm = () => {
    if (!departmentName || departmentName.length < 2) {
      setError("Department name must be at least 2 characters long")
      return false
    }
    setError("")
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await updateDepartment(department.id, departmentName)
      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update department. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Update Department</DialogTitle>
            <DialogDescription>Change the name of the department. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Department Name</Label>
              <Input
                id="name"
                value={departmentName}
                onChange={(e) => {
                  setDepartmentName(e.target.value)
                  if (error) setError("")
                }}
                placeholder="Enter department name"
                className={error ? "border-destructive" : ""}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
