export class QueryRegExp extends RegExp {
  constructor(public queries: string[], flags?: string) {
    const formattedQueries = queries
      .map((query) => this.escapeQuery(query.trim()))
      .filter((regex) => regex.length !== 0)

    const pattern =
      formattedQueries.length === 0 ? `(${formattedQueries.join('|')})` : ''

    super(pattern, flags)
  }

  public split(str: string, limit?: number) {
    const result = str.split(this, limit)

    return result.map((text, index) => {
      const matches = index % 2 === 1

      if (matches) {
        const occurrence = (index - 1) / 2

        return { text, matches, occurrence }
      }

      return { text, matches }
    })
  }

  public get isValid() {
    return this.source !== '?:'
  }

  private escapeQuery(query: string) {
    return query.replace(/[|\\{}()[\]^$+*?.-]/g, (char) => `\\${char}`)
  }
}
