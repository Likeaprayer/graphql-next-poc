export interface Department {
  id: string
  name: string
  sub_departments: Department[]
}

export interface CreateDepartmentInput {
  name: string
  sub_departments: { name: string }[] | null
}

export interface UpdateDepartmentInput {
  id: string
  name: string
}

export interface PaginatedDepartmentsResponse {
  departments: Department[]
  totalPages: number
}
