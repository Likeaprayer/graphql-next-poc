"use client"

import { useState } from "react"
import type { Department } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronDown, ChevronRight, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { deleteDepartment } from "@/lib/api"
import UpdateDepartmentDialog from "./update-department-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DepartmentListProps {
  departments: Department[]
  isLoading: boolean
  onRefresh: () => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function DepartmentList({
  departments,
  isLoading,
  onRefresh,
  currentPage,
  totalPages,
  onPageChange,
}: DepartmentListProps) {
  const [expandedDepartments, setExpandedDepartments] = useState<Record<number, boolean>>({})
  const [departmentToUpdate, setDepartmentToUpdate] = useState<Department | null>(null)
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null)
  const { toast } = useToast()

  const toggleExpand = (departmentId: number) => {
    setExpandedDepartments((prev) => ({
      ...prev,
      [departmentId]: !prev[departmentId],
    }))
  }

  const handleDelete = async () => {
    if (!departmentToDelete) return

    try {
      await deleteDepartment(departmentToDelete.id)
      toast({
        title: "Success",
        description: "Department deleted successfully.",
      })
      onRefresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete department. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDepartmentToDelete(null)
    }
  }

  const handleUpdateSuccess = () => {
    setDepartmentToUpdate(null)
    onRefresh()
    toast({
      title: "Success",
      description: "Department updated successfully.",
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Departments</CardTitle>
          <CardDescription>Loading departments...</CardDescription>
        </CardHeader>
        <CardContent>
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-4">
              <Skeleton className="h-8 w-full mb-2" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (departments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Departments</CardTitle>
          <CardDescription>No departments found</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No departments have been created yet. Click the "New Department" button to create one.
          </p>
        </CardContent>
      </Card>
    )
  }

  const renderDepartment = (department: Department, level = 0) => {
    const isExpanded = expandedDepartments[department.id] || false
    const hasSubDepartments = department.subDepartments && department.subDepartments.length > 0

    return (
      <div key={department.id} className="mb-2">
        <div
          className={`flex items-center justify-between p-3 rounded-md ${level === 0 ? "bg-muted/50" : "bg-background ml-6 border"}`}
        >
          <div className="flex items-center">
            {hasSubDepartments ? (
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-6 w-6 mr-2"
                onClick={() => toggleExpand(department.id)}
              >
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            ) : (
              <div className="w-6 mr-2" />
            )}
            <span className="font-medium">{department.name}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setDepartmentToUpdate(department)}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              onClick={() => setDepartmentToDelete(department)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
        {isExpanded && hasSubDepartments && (
          <div className="mt-1">{department.subDepartments.map((subDept) => renderDepartment(subDept, level + 1))}</div>
        )}
      </div>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Departments</CardTitle>
          <CardDescription>Manage your organization's departments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">{departments.map((department) => renderDepartment(department))}</div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => onPageChange(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {departmentToUpdate && (
        <UpdateDepartmentDialog
          department={departmentToUpdate}
          open={!!departmentToUpdate}
          onOpenChange={(open) => !open && setDepartmentToUpdate(null)}
          onSuccess={handleUpdateSuccess}
        />
      )}

      <AlertDialog open={!!departmentToDelete} onOpenChange={(open) => !open && setDepartmentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the department "{departmentToDelete?.name}" and all its sub-departments. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
