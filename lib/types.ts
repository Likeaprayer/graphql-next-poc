export interface Department {
  id: number
  name: string
  subDepartments: Department[]
}

export interface CreateDepartmentInput {
  name: string
  subDepartments: { name: string }[] | null
}

export interface PaginatedDepartmentsResponse {
  departments: Department[]
  totalPages: number
}
