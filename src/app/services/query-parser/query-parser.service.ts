/**
 * @module app.service.queryParser
 */
import { QueryOptions } from 'mongoose'
import { MongooseQueryParser } from 'mongoose-query-parser'

/**
 * Query Parser
 * @class
 * @alias app.service.queryParser.QueryParser
 */
class QueryParser {
  private parser: MongooseQueryParser

  constructor() {
    this.parser = new MongooseQueryParser({
      dateFormat: ['yyyyMMdd', 'yyyy-MM-dd'],
    })
  }

  /**
   * Parses url query to mongodb query
   */
  public async parse(query: string): Promise<QueryOptions> {
    return this.parser.parse(query)
  }
}

export default new QueryParser()
