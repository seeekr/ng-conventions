import esprima from 'esprima'
import estraverse from 'estraverse'
import assert from 'assert'
import path from 'path'
import escodegen from 'escodegen'
import kebapCase from 'lodash.kebabcase'

// we want to match dirname and dirobj and emit code that enhances dirobj
// angular.module(mname).directive(dirname, function () { return dirobj })
// translates to:
// (expr (call (property (call (property angular module) ?mname) directive) ?fun)

// simpler idea: let's match any return statement and check if it matches this:
// (call (member (... something ...) (id directive)) (fn (return obj))

// or: let's find (member (...) (id directive))

export default function process(filename, content, fileExistsCb = f => true) {
    const ast = esprima.parse(content)
    estraverse.traverse(ast, {
        enter (node) {
            // find call that does *.directive()
            // easy to go from there since the subtree contains all information we need
            if (node.type === 'CallExpression'
                && node.callee.type === 'MemberExpression'
                && node.callee.property.name === 'directive') {

                // accept only strings here
                assert(node.arguments[0].type === 'Literal')
                const dirName = node.arguments[0].value
                assert(dirName)

                // accept only function expression as 2nd arg
                const fn = node.arguments[1]
                assert(fn.type === 'FunctionExpression')

                // assume return statement is the last statement in the body
                // and that it must exist (what kind of directive would that be otherwise??)
                const retStmt = fn.body.body[fn.body.body.length - 1]
                assert(retStmt.type === 'ReturnStatement')

                // currently only processing further if it's a plain object expression
                if (retStmt.argument.type !== 'ObjectExpression') {
                    return
                }

                const obj = retStmt.argument

                // now we can actually do some work!

                // add sensible templateUrl
                const hasTemplateUrl = Boolean(obj.properties.find(p => p.key.name === 'templateUrl'))
                if (!hasTemplateUrl) {
                    const file = path.join(path.dirname(filename), kebapCase(dirName) + '.html')
                    if (!fileExistsCb(file)) {
                        return
                    }
                    obj.properties.push({
                        type: 'Property',
                        key: {type: 'Identifier', name: 'templateUrl'},
                        computed: false,
                        value: {type: 'Literal', value: file},
                        kind: 'init',
                        method: false,
                        shorthand: false
                    })
                }
            }
        }
    })

    return escodegen.generate(ast)
}
