export type Primitive = string | number | boolean | null | undefined

export type QueryValue = Primitive | Primitive[] | Record<string, Primitive | Primitive[]>

export type RouteQueryOptions = {
    query?: Record<string, QueryValue>
    mergeQuery?: Record<string, QueryValue>
}

type RouteMethod<TMethod extends string | readonly string[]> = TMethod extends readonly string[] ? TMethod[number] : TMethod

export type RouteDefinition<TMethod extends string | readonly string[]> = {
    url: string
} & (
    TMethod extends readonly string[]
        ? | {
              method: RouteMethod<TMethod>
              methods?: readonly RouteMethod<TMethod>[]
          }
          | {
              method?: never
              methods: readonly RouteMethod<TMethod>[]
          }
        : {
              method: RouteMethod<TMethod>
              methods?: readonly RouteMethod<TMethod>[]
          }
)

export type RouteFormDefinition<TMethod extends string> = {
    action: string
    method: TMethod
}

export function applyUrlDefaults<T>(args: T): T {
    return args
}

export function queryParams(options?: RouteQueryOptions): string {
    const query = options?.mergeQuery ?? options?.query

    if (!query || Object.keys(query).length === 0) {
        return ''
    }

    const searchParams = new URLSearchParams()

    const append = (key: string, value: QueryValue): void => {
        if (value === undefined) {
            return
        }

        if (value === null) {
            searchParams.append(key, '')
            return
        }

        if (Array.isArray(value)) {
            value.forEach((item) => append(key, item))
            return
        }

        if (typeof value === 'object') {
            Object.entries(value).forEach(([nestedKey, nestedValue]) => {
                append(`${key}[${nestedKey}]`, nestedValue)
            })
            return
        }

        searchParams.append(key, String(value))
    }

    Object.entries(query).forEach(([key, value]) => append(key, value))

    const serialized = searchParams.toString()

    return serialized ? `?${serialized}` : ''
}
