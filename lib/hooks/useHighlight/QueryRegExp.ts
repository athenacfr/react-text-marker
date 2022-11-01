interface RegExpOptions {
  hasIndices?: boolean
  global?: boolean
  ignoreCase?: boolean
  multiline?: boolean
  dotAll?: boolean
  unicode?: boolean
  sticky?: boolean
}

function createFlagsFromOptions(options: RegExpOptions) {
  let flags = ''
  if (options.hasIndices) flags += 'd'
  if (options.global) flags += 'g'
  if (options.ignoreCase) flags += 'i'
  if (options.multiline) flags += 'm'
  if (options.dotAll) flags += 's'
  if (options.unicode) flags += 'u'
  if (options.sticky) flags += 'y'
  return flags
}

export class QueryRegExp {
  public readonly regex: RegExp
  public readonly queries: string[]
  public readonly isValid: boolean

  constructor(query: string | string[], options: RegExpOptions = {}) {
    const queries = Array.isArray(query) ? query : [query]
    const queryPatterns = queries
      .map(this.formatQueryAsPattern)
      .filter((regex) => regex.length !== 0)
    const isValid = queryPatterns.length !== 0
    const pattern = isValid ? `(${queryPatterns.join('|')})` : ''

    this.queries = queries
    this.isValid = isValid
    this.regex = new RegExp(pattern, createFlagsFromOptions(options))
  }

  public split(str: string, limit?: number) {
    const result = str.split(this.regex, limit)

    return result.map((text, index) => {
      const matches = index % 2 === 1

      if (matches) {
        const occurrence = (index - 1) / 2

        return { text, matches, occurrence }
      }

      return { text, matches }
    })
  }

  private formatQueryAsPattern(query: string) {
    return query.trim().replace(/[|\\{}()[\]^$+*?.-]/g, (char) => `\\${char}`)
  }
}
