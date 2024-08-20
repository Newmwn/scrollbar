export interface JsonExpression{
  variables?: string;
  expression?: string;
}


/**
 * Convert a object with variables and expression string to function result
 *
 * Examples:
 *  {
 *    variables: '{"a": 5, "b": 10}',
 *    expression: 'return a + b * 2'
 *  }
 *
 *  {
 *    variables: '{"a": {"name": 29}, "b": 10}',
 *    expression: 'return a.name + b * 2'
 *  }
 *
 *  {
 *    variables: '{"a": {"name": "bino", "value": 10}, "b": [{"name": "joni", "value": 28}, {"name": "joni1", "value": 28}]}',
 *    expression: 'return b.map( (ele) => ele)[0].name + " " + a.name'
 *  }
 *
 *  {
 *    variables: '{"middleName": "Vasco"}'
 *    expression 'const ola = "Joni";  return (ola + " " + middleName)'
 *  }
 *
 */
export class JsonHelper {
  static expressionConvert(obj: JsonExpression): any {
    try {
      const variablesObj = JSON.parse(obj.variables as string);
      const variablesNames = Object.keys(variablesObj);
      const variablesValues = variablesNames.map(
        (field) => variablesObj[field]
      );
      const generateFunction = new Function(
        ...variablesNames,
        `return (function addEvents() { ${obj.expression} })();`
      );

      return generateFunction(...variablesValues);
    } catch (err) {
      return `Erro ao tentar executar função no json => ${err};`;
    }
  }

}
