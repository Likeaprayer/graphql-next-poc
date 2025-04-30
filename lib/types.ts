export interface Department {
  id: string
  name: string
  subDepartments: Department[]
}

export interface CreateDepartmentInput {
  name: string
  subDepartments: { name: string }[] | null
}

export interface UpdateDepartmentInput {
  id: string
  name: string
}

export interface PaginatedDepartmentsResponse {
  departments: Department[]
  totalPages: number
}
