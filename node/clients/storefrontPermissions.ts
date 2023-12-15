import type { InstanceOptions, IOContext } from '@vtex/api'
import { AppGraphQLClient } from '@vtex/api'

import { getTokenToHeader } from './index'

export const QUERIES = {
  getPermission: `query permissions {
    checkUserPermission {
      role {
        id
        name
        slug
      }
      permissions
    }
  }`,
  getRole: `query role($id: ID!) {
    getRole(id: $id) {
      id
      name
      slug
    }
  }`,
  getUser: `query user($id: ID!) {
    getUser(id: $id) {
      id
      roleId
      userId
      clId
      orgId
      costId
      name
      email
      canImpersonate
    }
  }`,
  listRoles: `query roles {
    listRoles {
      id
      name
      slug
    }
  }`,
  listUsers: `query users($organizationId: ID, $costCenterId: ID, $roleId: ID) {
    listUsers(organizationId: $organizationId, costCenterId: $costCenterId, roleId: $roleId) {
      id
      roleId
      userId
      clId
      orgId
      costId
      name
      email
      canImpersonate
    }
  }`,
}

export default class StorefrontPermissions extends AppGraphQLClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super('vtex.storefront-permissions@1.x', ctx, options)
  }

  public checkUserPermission = async (): Promise<any> => {
    return this.query({
      extensions: this.getPersistedQuery(),
      query: QUERIES.getPermission,
      variables: {},
    })
  }

  public listRoles = async (): Promise<any> => {
    return this.query({
      extensions: this.getPersistedQuery(),
      query: QUERIES.listRoles,
      variables: {},
    })
  }

  public listUsers = async ({
    roleId,
    organizationId,
  }: {
    roleId: string
    organizationId?: string
  }): Promise<any> => {
    return this.query({
      extensions: this.getPersistedQuery(),
      query: QUERIES.listUsers,
      variables: {
        roleId,
        ...(organizationId && { organizationId }),
      },
    })
  }

  private getPersistedQuery = () => {
    return {
      persistedQuery: {
        provider: 'vtex.storefront-permissions@1.x',
        sender: 'vtex.b2b-quotes@0.x',
      },
    }
  }

  private query = async (param: {
    query: string
    variables: any
    extensions: any
  }): Promise<any> => {
    const { query, variables, extensions } = param

    return this.graphql.query(
      {
        extensions,
        query,
        variables,
      },
      {
        headers: getTokenToHeader(this.context),
        params: {
          locale: this.context.locale,
        },
      }
    )
  }
}
