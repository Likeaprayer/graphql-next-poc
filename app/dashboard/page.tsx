"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, RefreshCw } from "lucide-react"
import DepartmentList from "@/components/department-list"
import { useToast } from "@/components/ui/use-toast"
import { isAuthenticated } from "@/lib/auth"
import CreateDepartmentDialog from "@/components/create-department-dialog"
import type { Department } from "@/lib/types"
import { getDepartments } from "@/lib/api"

export default function DashboardPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { toast } = useToast()
  const router = useRouter()

  const fetchDepartments = async (page = 1) => {
    setIsLoading(true)
    try {
      const depts = await getDepartments(page)
      setDepartments(depts)
      // console.log
      // setTotalPages(pages)
      // setCurrentPage(page)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch departments. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated()) {

      router.push("/login")
      return
    }

    fetchDepartments()
  }, [router])

  const handleCreateSuccess = () => {
    setIsDialogOpen(false)
    fetchDepartments()
    toast({
      title: "Success",
      description: "Department created successfully.",
    })
  }

  const handlePageChange = (page: number) => {
    fetchDepartments(page)
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Department Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => fetchDepartments(currentPage)} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Department
          </Button>
        </div>
      </div>

      <DepartmentList
        departments={departments}
        isLoading={isLoading}
        onRefresh={() => fetchDepartments(currentPage)}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <CreateDepartmentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onSuccess={handleCreateSuccess} />
    </div>
  )
}
