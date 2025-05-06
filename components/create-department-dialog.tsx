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
import { createDepartment } from "@/lib/api"
import { Plus, Trash2 } from "lucide-react"

interface CreateDepartmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export default function CreateDepartmentDialog({ open, onOpenChange, onSuccess }: CreateDepartmentDialogProps) {
  const [departmentName, setDepartmentName] = useState("")
  const [subDepartments, setSubDepartments] = useState<{ name: string }[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  const resetForm = () => {
    setDepartmentName("")
    setSubDepartments([])
    setErrors({})
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  const addSubDepartment = () => {
    setSubDepartments([...subDepartments, { name: "" }])
  }

  const removeSubDepartment = (index: number) => {
    const newSubDepartments = [...subDepartments]
    newSubDepartments.splice(index, 1)
    setSubDepartments(newSubDepartments)
  }

  const updateSubDepartmentName = (index: number, name: string) => {
    const newSubDepartments = [...subDepartments]
    newSubDepartments[index].name = name
    setSubDepartments(newSubDepartments)

    // Clear error for this field if it exists
    if (errors[`subDepartments.${index}.name`]) {
      const newErrors = { ...errors }
      delete newErrors[`subDepartments.${index}.name`]
      setErrors(newErrors)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!departmentName || departmentName.length < 2) {
      newErrors.name = "Department name must be at least 2 characters long"
    }

    subDepartments.forEach((subDept, index) => {
      if (!subDept.name || subDept.name.length < 2) {
        newErrors[`subDepartments.${index}.name`] = "Sub-department name must be at least 2 characters long"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await createDepartment({
        name: departmentName,
        sub_departments: subDepartments.length > 0 ? subDepartments : null,
      })

      resetForm()
      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create department. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Department</DialogTitle>
            <DialogDescription>
              Add a new department to your organization. You can also add sub-departments.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Department Name</Label>
              <Input
                id="name"
                value={departmentName}
                onChange={(e) => {
                  setDepartmentName(e.target.value)
                  if (errors.name) {
                    const newErrors = { ...errors }
                    delete newErrors.name
                    setErrors(newErrors)
                  }
                }}
                placeholder="Enter department name"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Sub-Departments (Optional)</Label>
                <Button type="button" variant="outline" size="sm" onClick={addSubDepartment}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>

              {subDepartments.length > 0 ? (
                <div className="space-y-2">
                  {subDepartments.map((subDept, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={subDept.name}
                        onChange={(e) => updateSubDepartmentName(index, e.target.value)}
                        placeholder={`Sub-department ${index + 1} name`}
                        className={errors[`subDepartments.${index}.name`] ? "border-destructive" : ""}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSubDepartment(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                      {errors[`subDepartments.${index}.name`] && (
                        <p className="text-sm text-destructive absolute mt-10">
                          {errors[`subDepartments.${index}.name`]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No sub-departments added yet. Click the "Add" button to add one.
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Department"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
