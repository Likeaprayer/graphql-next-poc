import { ApolloClient, InMemoryCache, createHttpLink, gql } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { getAuthToken } from "./auth"
import type { CreateDepartmentInput, Department, PaginatedDepartmentsResponse, UpdateDepartmentInput } from "./types"

// Create an HTTP link
const httpLink = createHttpLink({
  uri: `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
})

// Create an auth link
const authLink = setContext((_, { headers }) => {
  const token = getAuthToken()
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  }
})

// Create Apollo Client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

// GraphQL Queries and Mutations
const GET_DEPARTMENTS = gql`
  query GetDepartments {
    getDepartments {
        id
        name
        sub_departments {
          id
          name
        }
      
      # totalPages
    }
  }
`

const CREATE_DEPARTMENT = gql`
  mutation CreateDepartment($input: CreateDepartmentInput!) {
    createDepartment(createDepartmentInput: $input) {
      id
      name
      sub_departments {
        id
        name
      }
    }
  }
`

const UPDATE_DEPARTMENT = gql`
  mutation UpdateDepartment($input: UpdateDepartmentInput!) {
    updateDepartment(updateDepartmentInput: $input) {
      id
      name
    }
  }
`

const DELETE_DEPARTMENT = gql`
  mutation DeleteDepartment($id: String!) {
    deleteDepartment(id: $id)
  }
`

// API Functions
export async function getDepartments(page = 1): Promise<Department[]> {
  try {
    const { data } = await client.query({
      query: GET_DEPARTMENTS,
      fetchPolicy: "network-only",
    })
    return data.getDepartments
  } catch (error) {
    console.error("Error fetching departments:", error)
    throw new Error("Failed to fetch departments")
  }
}

export async function createDepartment(input: CreateDepartmentInput): Promise<Department> {
  try {
    const { data } = await client.mutate({
      mutation: CREATE_DEPARTMENT,
      variables: { input },
    })
    return data.createDepartment
  } catch (error) {
    console.error("Error creating department:", error)
    throw new Error("Failed to create department")
  }
}

export async function updateDepartment(input: UpdateDepartmentInput): Promise<Department> {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_DEPARTMENT,
      variables: { input },
    })
    return data.updateDepartment
  } catch (error) {
    console.error("Error updating department:", error)
    throw new Error("Failed to update department")
  }
}

export async function deleteDepartment(id: string): Promise<boolean> {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_DEPARTMENT,
      variables: { id },
    })
    return data.deleteDepartment
  } catch (error) {
    console.error("Error deleting department:", error)
    throw new Error("Failed to delete department")
  }
}
