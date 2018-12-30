
  // Convert a path (a.b[123].c) to an array [ {name:'a',index:-1}, {name:'b',index:123}, {name:'c',index:-1}]
export function parseDataPath (path) {
  // console.log(`--- parseDataPath(${path})`);
  path = path.trim()
  // if (!path.startsWith('!')) {
  //   console.error(`Invalid data path (${path}): must start with '!'.`);
  //   return null
  // } else if (path === '!') {
  //   console.error(`Invalid data path (${path}): must have a name.`);
  //   return null
  // }

  // let p = path.substring(1)
  let p = path
  let parts = [ ]
  for ( ; ; ) {
    // Check for nothing left (after a trainling dot)
    if (p === '') {
      return parts
    }

    let pos = p.indexOf('.')
    if (pos < 0) {

      // There is no next dot. Everything left is a part spec.
      let part = parseDataPart(p)
      if (part) {
        parts.push(part)
        return parts
      } else {
        return null // error already reported
      }
    } else if (pos === 0) {
      // Have multiple consecutive dots, ignore this one.
      p = p.substring(1)
    } else {

      // Parse up to the next dot
      let spec = p.substring(0, pos)
      p = p.substring(pos)
      let part = parseDataPart(spec)
      if (part) {
        parts.push(part)
      } else {
        return null // error already reported
      }

    }
  }
}

  // Parse a specification of the form <name> or <name>[index].
export function parseDataPart (spec) {

  // Check for '['
  spec = spec.trim()
  let openBracketPos = spec.indexOf('[')
  if (openBracketPos < 0) {

    // Default index of 0
    // console.log(`parseDataPart: default index: ${spec}`)
    return { name: spec, index: -1}
  } else {

    // Specify an index
    // console.log(`parseDataPart: with index: ${spec}`);
    let name = spec.substring(0, openBracketPos)
    let indexSpec = spec.substring(openBracketPos)
    console.log(`indexSpec=${indexSpec}`)
    // Check for ']'
    let closeBracketPos = indexSpec.indexOf(']')
    if (closeBracketPos < 0) {
      console.error(`Invalid path component(${spec}), expected ']'`);
      return null
    } else if (closeBracketPos != indexSpec.length - 1) {
      console.error(`Invalid path component(${spec}), unexpected char after ']'`);
      // console.log(`closeBracketPos=${closeBracketPos}, indexSpec.length - 1`);
      return null
    }
    // Convert to a number
    indexSpec = indexSpec.substring(1, closeBracketPos).trim()
    // console.log(`indexSpec=${indexSpec}`)
    let index = parseInt(indexSpec)
    if (isNaN(index)) {
      console.error(`Invalid path component(${spec}), non-integer index.`)
    }
    return { name, index }
  }
}


export function pathFromParts(parts, level, skipFinalIndex) {
  // console.log(`pathFromParts(parts, ${level}, ${skipFinalIndex})`, parts);
  if (typeof(level) !== 'number' || level < 0) {
    level = parts.length - 1
  }
  let path = ''
  for (let i = 0; (level >= 0 && i <= level) && level < parts.length; i++) {
    let part = parts[i]
    if (i > 0) {
      path += '.'
    }
    path += part.name
    if (part.index >= 0) {
      if (skipFinalIndex && i >= level) {
        // Don't display the final [x]
      } else {
        path += `[${part.index}]`
      }
    }
  }
  // console.log(`--- ${path}`);
  return path
}

export function pathSpaces(parts, level, skipFinalIndex) {
  let len = pathFromParts(parts, level, skipFinalIndex).length
  // if (parts[level].index < 0 && !skipFinalIndex) {
  //   len++
  // }
  let s = ''
  while (len-- > 0) {
    s += ' '
  }
  return s
}

export function describe(obj) {
  if (obj === null) {
    return 'null'
  } else if (obj === undefined) {
    return 'undefined'
  } else if (Array.isArray(obj)) {
    return 'list'
  } else if (typeof(obj) === 'object') {
    if (obj instanceof Date) {
      return 'date'
    }
    return 'record'
  } else {
    return typeof(obj)
  }
}

// export function whatWeNeed = (parts, level) => {
//   // See what we need
//   let need
//   if (index < 0) {
//     need = isFinalPart ? WHATEVER : RECORD
//   } else {
//     need = ELEMENT_IN_ARRAY
//   }
// }
