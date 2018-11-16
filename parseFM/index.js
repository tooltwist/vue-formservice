/*
 *  Convert ADL Forms definitions to formservice.io
 *
 *  For ADL Forms syntax, refer to the Visual Basic documentation.
 *  https://docs.microsoft.com/en-us/office/vba/api/access.label.backstyle
 */

let fs = require('fs')
let readline = require('readline')
const filename = 'AUQLDREPMT12v6.8.2.txt'

// VB6 uses "twips" for screen positions, widths and heights.
// A twip is device-dependant, at 1440 twips per inch.
// However a website uses pixels, so we conversion for a typical screen.
const TWIPS_PER_PIXEL = 15

let form = {
  filename: filename,
  name: null,
  genericName: null,
  displayName: null,
  sections: [ ]
}
let section = null
let element = null
let elementType = null
let nextId = 10000000000

// Parse the file, line by line
let input = fs.createReadStream(`Forms/${filename}`)
let rl = require('readline').createInterface({ input })
let lineNo = 0

let fatal = msg => {
  console.error(`\nError:\nLine ${lineNo}: ${msg}\nParsing incomplete.`);
  process.exit(1)
}

// Start parsing lines in the file
rl.on('line', line => {
  ++lineNo
  // console.log(`${lineNo} -> ${line}`);

  // Are we switching section?
  if (line.startsWith('[Header]')) {

    // Start of the Header section
    sectionType = '[Header]'
  } else if (line.startsWith('[')) {

    // Starting a new section
    sectionType = 'Section'
    let endBracePos = line.indexOf(']')
    section = {
      sectionName: line.substring(1, endBracePos),
      elements: [ ]
    }
    form.sections.push(section)
  } else {

    // A line within the current section
    if (section) {
      return parseSection(line)
    } else {
      // Still parsing the header
      return parseHeader(line)
    }
  }
})

rl.on('close', () => {
  console.log(`Parsing complete.`);
  // dump()
  convertForm()
})

function parseHeader (line) {
  let value = getValue(line)
  if (line.startsWith('DisplayName')) {
    form.displayName = value
  } else if (line.startsWith('FormName')) {
    form.name = value
  } else if (line.startsWith('GenericName')) {
    form.genericName = value
  }
}

function parseSection (line) {

  // Handle [Page] section definitions
  if (line.startsWith('Orientation')) {
  }
  else if (line.startsWith('ExpandablePage')) {
  }
  else if (line.startsWith('HeaderFooterAllowed')) {
  }

  // Handle element types
  else if (line.startsWith('Frame')) {
    elementType = 'Frame'
    element = {
      type: 'frame'
    }
    section.elements.push(element)
  } else if (line.startsWith('Check1')) {
    elementType = 'Check1'
    element = {
      type: 'checkbox'
    }
    section.elements.push(element)
  } else if (line.startsWith('Label')) {
    elementType = 'Label'
    element = {
      type: 'label'
    }
    section.elements.push(element)
  } else if (line.startsWith('Text')) {
    elementType = 'Text'
    element = {
      type: 'text'
    }
    section.elements.push(element)
  } else if (line.startsWith('Line')) {
    elementType = 'Line'
    element = {
      type: 'line'
    }
    section.elements.push(element)
  } else if (line.startsWith('Option')) {
    elementType = 'Option'
    element = {
      type: 'option'
    }
    section.elements.push(element)
  } else if (line.startsWith('Picture')) {
    elementType = 'Picture'
    element = {
      type: 'picture'
    }
    section.elements.push(element)
  } else if (line.startsWith('Shape')) {
    elementType = 'Shape'
    element = {
      type: 'shape'
    }
    section.elements.push(element)
  } else if (line.startsWith(' ')) {
    switch (elementType) {
      case 'Frame': return parseFrame(line);
      case 'Check1': return parseCheck1(line);
      case 'Label': return parseLabel(line);
      case 'Text': return parseText(line);
      case 'Line': return parseLine(line);
      case 'Option': return parseOption(line);
      case 'Picture': return parsePicture(line);
      case 'Shape': return parseShape(line);
      default:
        fatal(`Internal error - cannot parse elementType ${elementType}`)
    }
  } else {
    // Line with no indenting
    fatal(`Unknown element on page: ${line}`);
  }

}

// Frame
//   Name                        = Frame1
//   Container                   = -1
//   BorderStyle                 = 0
//   BackColor                   = 16777215
//   Height                      = 300
//   Index                       = 1
//   Left                        = 2775
//   Top                         = 5875
//   Width                       = 8675
//   -----------------           =
//   Location                    = 5
//   LockBottomTo                =
//   LockTopTo                   =
//   Print                       = True
//   WinFace                     = False
function parseFrame (line) {
  // https://docs.microsoft.com/en-us/previous-versions/visualstudio/visual-basic-6/aa267216(v=vs.60)
  // console.log(`parseFrame: ${line}`);
  if (false) { }
  else if (line.startsWith('  Name')) {
    element.name = getValue(line)
  }
  else if (line.startsWith('  Container')) {
    element.container = getInteger(line)
  }
  else if (line.startsWith('  BorderStyle')) {
    element.borderStyle = getInteger(line)
  }
  else if (line.startsWith('  BackColor')) {
    element.bgColor = getColor(line)
  }
  else if (line.startsWith('  Height')) {
    element.height = getInteger(line)
  }
  else if (line.startsWith('  Index')) {
    element.index = getValue(line)
  }
  else if (line.startsWith('  Left')) {
    element.x = getInteger(line)
  }
  else if (line.startsWith('  Top')) {
    element.y = getInteger(line)
  }
  else if (line.startsWith('  Width')) {
    element.width = getInteger(line)
  }
  // else if (line.startsWith('  Location')) {
  //   element.width = getInteger(line)
  // }
}

function parseCheck1 (line) {
  if (false) { }
  else if (line.startsWith('  Name')) {
    element.name = getValue(line)
  }

  // Position
  else if (line.startsWith('  TabIndex')) {
    element.tabIndex = getValue(line)
  }
  else if (line.startsWith('  Container')) {
    element.container = getValue(line)
  }
  else if (line.startsWith('  Height')) {
    element.height = getValue(line)
  }
  else if (line.startsWith('  Left')) {
    element.x = getValue(line)
  }
  else if (line.startsWith('  Top')) {
    element.y = getValue(line)
  }
  else if (line.startsWith('  Width')) {
    element.width = getValue(line)
  }


  else if (line.startsWith('  GroupName')) {
    element.groupName = getValue(line)
  }
  else if (line.startsWith('  GroupNumber')) {
    element.groupNumber = getValue(line)
  }
  else if (line.startsWith('  Title')) {
    element.label = getValue(line)
  }
  // else if (line.startsWith('  Width')) {
  //   element.width = getValue(line)
  // }
  // BackColor                   = 16777215
  // Caption                     =
  // Checked                     = 0
  // FontName                    = Arial Narrow
  // FontBold                    = False
  // FontItalic                  = False
  // FontSize                    = 9
  // FontUnderline               = False
  // ForeColor                   = 0
  // GenericAssociation          = ^0
  // -----------------           =
  // ConditionalEffect           =
  // Location                    = 5
  // LockBottomTo                =
  // LockFieldsWhenTicked        =
  // LockFieldsWhenUnticked      =
  // LockTopTo                   =
  // Print                       = True
  // PrintType                   = 1
  // RPXUpload                   = False

}

function parseLabel (line) {
  // Label
  //   Name                        = Label1
  //   Container                   = -1
  //   AlignHor                    = 0
  //   AlignVert                   = 0
  //   AllowCrossOut               = False
  //   Angle                       = 0
  //   BorderStyle                 = 0
  //   BackStyle                   = 1
  //   BackColor                   = 16777215
  //   Clause                      = Label1
  //   FontName                    = Arial
  //   FontBold                    = True
  //   FontItalic                  = False
  //   FontSize                    = 9
  //   FontStrikethru              = False
  //   FontUnderline               = False
  //   ForeColor                   = 0
  //   Height                      = 250
  //   LabelType                   = 1
  //   Left                        = 800
  //   LineSpaceAdjust             = 0
  //   Text                        = Entry is sought under the following grounds
  //   Top                         = 9625
  //   Width                       = 4600
  //   -----------------           =
  //   Location                    = 5
  //   LockBottomTo                =
  //   LockTopTo                   =
  //   Print                       = True
  //   WordWrap                    = True
  if (false) { }
  else if (line.startsWith('  Name')) {
    element.name = getValue(line)
  }

  // Position
  else if (line.startsWith('  Container')) {
    element.container = getInteger(line)
  }
  else if (line.startsWith('  Height')) {
    element.height = getInteger(line)
  }
  else if (line.startsWith('  Left')) {
    element.x = getInteger(line)
  }
  else if (line.startsWith('  Top')) {
    element.y = getInteger(line)
  }
  else if (line.startsWith('  Width')) {
    element.width = getInteger(line)
  }

  // Styling
  else if (line.startsWith('  BackColor')) {
    element.backColor = getColor(line)
  }
  else if (line.startsWith('  FontName')) {
    element.fontName = getValue(line)
  }
  else if (line.startsWith('  FontBold')) {
    element.fontBold = getValue(line)
  }
  else if (line.startsWith('  FontItalic')) {
    element.fontItalic = getValue(line)
  }
  else if (line.startsWith('  FontSize')) {
    element.fontSize = getValue(line)
  }
  else if (line.startsWith('  FontStrikethru')) {
    element.fontStrikethru = getValue(line)
  }
  else if (line.startsWith('  FontUnderline')) {
    element.fontUnderline = getValue(line)
  }
  else if (line.startsWith('  ForeColor')) {
    element.foreColor = getColor(line)
  }

  // Other
  else if (line.startsWith('  LabelType')) {
    element.labelType = getValue(line)
  }
  else if (line.startsWith('  Text')) {
    element.label = getValue(line)
  }
}

function parseText (line) {
  // Text
  //   Name                        = tEntryTimeStart|tEntryTime
  //   TextBoxType                 = 10
  //   Container                   = 9
  //   BorderStyle                 = 0
  //   BackColor                   = 16777215
  //   DisplayAlignment            = 0
  //   FontName                    = Arial
  //   FontBold                    = True
  //   FontItalic                  = False
  //   FontSize                    = 9.761248
  //   ForeColor                   = 0
  //   GenericAssociation          = [Entry Notice Qld\Time\Start] ^0
  //   Height                      = 300
  //   Left                        = 625
  //   ListSelect                  =
  //   MaxLength                   = 0
  //   TabIndex                    = 34
  //   Text                        = Time
  //   Top                         = 0
  //   Underline                   = 0
  //   Width                       = 1000
  //   -----------------           =
  //   AbbreviatedComboList        =
  //   AreaCodeWidth               = 0
  //   Boxed                       = False
  //   BoxedSubtitle               = False
  //   CharSpacing                 = False
  //   ConditionalEffect           =
  //   ConjunctionType             =
  //   DecimalPlaces               = 0
  //   DecimalPos                  = 0
  //   Default                     =
  //   DelimChar                   =
  //   DelimPos                    = 0
  //   DelimPrint                  = True
  //   AbbreviatedComboList        =
  //   EqualSpacedTextType         = 0
  //   FieldSetType                = 0
  //   LabelPrintNum               =
  //   Location                    = 5
  //   LockBottomTo                =
  //   LockTopTo                   =
  //   Mandatory                   = False
  //   Print                       = True
  //   RPXUpload                   = False
  //   Title                       = Entry - Start Time
  //   BoxedPunctuation            =
  //   DollarPos                   = 0
  //   TimeFormat                  = 0
  //   CommaFormatting             = False
  //   ConjunctionFields           =
  //   ConjunctionSwapDetails      =
  //   AlignVertical               = 0
  if (false) { }
  else if (line.startsWith('  Name')) {
    element.name = getValue(line)
  }
  else if (line.startsWith('  TextBoxType')) {
    element.textboxType = getInteger(line)
  }
  else if (line.startsWith('  BorderStyle')) {
    element.borderStyle = getInteger(line)
  }
  else if (line.startsWith('  BackColor')) {
    element.backColor = getColor(line)
  }
  else if (line.startsWith('  FontName')) {
    element.fontName = getValue(line)
  }
  else if (line.startsWith('  FontBold')) {
    element.fontBold = getValue(line)
  }
  else if (line.startsWith('  FontItalic')) {
    element.fontItalic = getValue(line)
  }
  else if (line.startsWith('  FontSize')) {
    element.fontSize = getValue(line)
  }
  else if (line.startsWith('  ForeColor')) {
    element.foreColor = getColor(line)
  }

  // Position
  else if (line.startsWith('  Container')) {
    element.container = getInteger(line)
  }
  else if (line.startsWith('  TabIndex')) {
    element.tabIndex = getInteger(line)
  }
  else if (line.startsWith('  Height')) {
    element.height = getInteger(line)
  }
  else if (line.startsWith('  Left')) {
    element.x = getInteger(line)
  }
  else if (line.startsWith('  Top')) {
    element.y = getInteger(line)
  }
  else if (line.startsWith('  Width')) {
    element.width = getInteger(line)
  }

  // Other
  else if (line.startsWith('  GenericAssociation')) {
    element.genericAssociation = getValue(line)
  }
  else if (line.startsWith('  Text')) {
    element.text = getValue(line)
  }
  else if (line.startsWith('  Title')) {
    element.title = getValue(line)
  }

}

function parseLine (line) {
  // Line
  //   Container                   = -1
  //   BorderStyle                 = 1
  //   BorderColor                 = -2147483640
  //   BorderWidth                 = 2
  //   x1                          = 500
  //   x2                          = 11500
  //   y1                          = 1450
  //   y2                          = 1450
  //   -----------------           =
  //   Location                    = 5
  //   LockBottomTo                =
  //   LockTopTo                   =
  //   Print                       = True

}

function parseOption (line) {
  // Option
  //   Name                        = oLessor
  //   Container                   = 1
  //   BackColor                   = 16777215
  //   Caption                     =
  //   Checked                     = False
  //   FontName                    = Arial Narrow
  //   FontBold                    = False
  //   FontItalic                  = False
  //   FontSize                    = 9.010383
  //   FontUnderline               = False
  //   ForeColor                   = 0
  //   GenericAssociation          = [Entry Notice Qld\Giver of Notice (1-3 OR Lessor,Renting Agent,Secondary Agent)] ^0
  //   Height                      = 300
  //   Left                        = 50
  //   TabIndex                    = 7
  //   Top                         = 0
  //   Width                       = 300
  //   -----------------           =
  //   ConditionalEffect           =
  //   GroupName                   = Party Serving Notice
  //   GroupNumber                 = 1
  //   Location                    = 5
  //   LockBottomTo                =
  //   LockFieldsWhenTicked        =
  //   LockFieldsWhenUnticked      =
  //   LockTopTo                   =
  //   Print                       = True
  //   PrintType                   = 1
  //   RPXUpload                   = False
  //   Title                       = Property Owner

}

function parsePicture (line) {
  // Picture
  //   Name                        = Picture1
  //   Container                   = -1
  //   Height                      = 825
  //   Left                        = 9525
  //   Print                       = True
  //   AbbreviatedComboList        =
  //   Stretch                     = True
  //   Top                         = 375
  //   UserLogo                    = False
  //   Width                       = 1950
  //   -----------------           =
  //   Picture                     = RTA_Logo_Nov12.gif
  //   Location                    = 5
  //   LockBottomTo                =
  //   LockTopTo                   =
  //   ShowOnScreen                = True

}

function parseShape (line) {
  // Shape
  //   Container                   = -1
  //   BorderStyle                 = 1
  //   BorderColor                 = 0
  //   BorderWidth                 = 1
  //   FillColor                   = 0
  //   FillStyle                   = 1
  //   Height                      = 625
  //   Left                        = 5875
  //   Top                         = 15100
  //   Width                       = 3625
  //   -----------------           =
  //   Direction                   = 2
  //   Location                    = 5
  //   LockBottomTo                =
  //   LockTopTo                   =
  //   Print                       = True
  //   Radius                      = 5
  //   Shape                       = 0

}




// Return the value from a line of the form:
// <name><spaces>=<spaces><value>
function getValue(line) {
  let i = line.indexOf('=')
  if (i > 0) {
    for (i++; line.charAt(i) == ' '; i++) {
    }
    return line.substring(i)
  }
  return null
}

// Return an integer from a line of the form:
// <name><spaces>=<spaces><integer>
function getInteger(line) {
  let i = line.indexOf('=')
  if (i > 0) {
    for (i++; line.charAt(i) == ' '; i++) {
    }
    try {
      return parseInt(line.substring(i))
    } catch {

    }
  }
  return -1
}

// Convert an String RGB value (integer) to String (#rrggbb)
function getColor (line) {
  // console.log(`getColor(${line})`)
  let i = line.indexOf('=')
  if (i > 0) {
    for (i++; line.charAt(i) == ' '; i++) {
    }
    let value = line.substring(i)
    // console.log(`=> getColor(${value})`)
    let rgb = parseInt(value)
    // console.log(`=> getColor(${rgb})`)

    let redComponent = rgb % 256
    let greenComponent = Math.floor(rgb / 256) % 256
    let blueComponent = Math.floor(rgb / 65536) % 256
    // console.log(`=> ${redComponent}  ${greenComponent}  ${blueComponent}`)

    let r1 = Math.floor(redComponent / 16) % 16
    let r2 = (redComponent % 16)
    let g1 = Math.floor(greenComponent / 16) % 16
    let g2 = (greenComponent % 16)
    let b1 = Math.floor(blueComponent / 16) % 16
    let b2 = (blueComponent % 16)

    const chars = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']
    // console.log(`=> ${chars[r1]} ${chars[r2]}, ${chars[g1]} ${chars[g2]}, ${chars[b1]} ${chars[b2]}`);
    return `#${chars[r1]}${chars[r2]}${chars[g1]}${chars[g2]}${chars[b1]}${chars[b2]}`
  }
  return '#888888'
}

// // Return { x, y } for a container element in a section
// function getContainerCoordinates(section, index) {
//   if (index >= 0 && index < section.elements.length) {
//     let container = section.elements[index]
//     console.log(`Container ${index} is`, container);
//     return { x: container.x, y: container.y }
//   }
//   return { x: 0, y: 0 }
// }

// Find a container element in a section
function findContainer(section, index) {
  if (index >= 0 && index < section.elements.length) {
    let container = section.elements[index]
    console.log(`Container ${index} is`, container);
    return container
  }
  return null
}


function dump () {
  console.log(`zzz`);
  console.log(form);
  form.sections.forEach(section => {
    console.log(`-----------------\nSection ${section.sectionName}`);
    console.log(section.elements);
  })
}

function convertForm () {
  form.sections.forEach(section => {
    convertSection(section)
  })
}

function convertSection (section) {
  console.log(`vvvvv SECTION vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv`);
  // console.log(`Section is `, section);

  let def = {
    "type": "contentservice.io",
    "version": "1.0",
    "source": `imported ${form.filename} (${section.sectionName})`,
    "timestamp": "2018-11-15T12:48:21.615Z",
    "layout": {
      "type": "formservice",
      "id": nextId++,
      width: 800,
      height: 1150,
      "style": "border: solid 1px black;",
      "children": [
      ]
    }
  }

  section.elements.forEach(element => {
    let child = null
    switch (element.type) {
      case 'label':
        child = convertLabel(element)
        break
      case 'frame':
        child = convertFrame(element)
        break
      case 'text':
        child = convertText(element)
        break
    }

    // Add the new child (if any) to the section
    if (child) {
      if (element.container < 0) {

        // Does not specify 'Container', so add it to the Section
        def.layout.children.push(child)
      } else {

        // DOES specify 'Container', so add it to a Frame
        // 'Container' starts at 1
        if (element.container >= 1 && element.container <= def.layout.children.length) {
          let container = def.layout.children[element.container-1]
          // console.log(`--------------------------`);
          // for (var i = 0; i <= element.container - 1; i++)
          //   console.log(` ${i}: ${def.layout.children[i].name}`);
          // console.log(`\nAdd:`, element)
          // console.log(`\nTo ${element.container}:`, container)
          // console.log(`${element.type} in container ${element.container}:`, container)
          if (container.type !== 'formservice') {
            console.log(`Error: ${element.type} uses non-frame Container ${element.container}`)
          } else {
            container.children.push(child)
          }
        } else {
          console.log(`Error: ${element.type} uses unknown Container ${element.container}`);
        }
      }
    }
  })

  // Display the section as JSON
  let json = JSON.stringify(def, null, 2)
  console.log(`\n\nSection ${section.sectionName} definition:\n\n${json}`);
}

function convertFrame (element) {
  // console.log(`  label ${element.label}`);
  let x = Math.floor(parseInt(element.x) / TWIPS_PER_PIXEL)
  let y = Math.floor(parseInt(element.y) / TWIPS_PER_PIXEL)
  let w = Math.floor(parseInt(element.width) / TWIPS_PER_PIXEL)
  let h = Math.floor(parseInt(element.height) / TWIPS_PER_PIXEL)

  let style = ''
  if (element.backColor) {
    style += `background-color:${element.backColor}; `
  }
  if (element.fontName) {
    style += `font-family:${element.fontName}; `
  }
  if (element.fontBold === 'True') {
    style += 'font-weight:bold; '
  }
  if (element.fontItalic === 'True') {
    style += 'font-style:italic; '
  }
  if (element.fontSize) {
    style += `font-size:${parseInt(element.fontSize)}px; `
  }
  if (element.fontStrikethru === 'True') {
    style += 'text-decoration:line-through; '
  }
  if (element.fontUnderline === 'True') {
    style += 'text-decoration:underline; '
  }
  if (element.foreColor === 'True') {
    style += `color:${element.foreColor}; `
  }

  // Border style
  // https://docs.microsoft.com/en-us/previous-versions/visualstudio/visual-basic-6/aa245047(v%3dvs.60)
  //  0 = none
  //  1 = Fixed single
  //  2 = Sizeable
  //  3 = Fixed double
  //  4 = Fixed Tool window (close button, title, etc)
  //  5 = Sizeable, close button, title, in reduced size
  if (element.borderStyle > 0) {
    style += 'border: solid 1px #333;'
  }

  // style = 'width:100px; height:100px; background-color:cyan;'

  return {
    "type": "formservice",
    "name": element.name,
    // "label": `${element.label}`,
    "id": nextId++,
    style: `${style}`,
    width: `${w}`,
    height: `${h}`,
    "_fixed": true,
    "_fixed_x": x,
    "_fixed_y": y,
    "children": []
  }
}

function convertLabel (element) {
  // console.log(`  label ${element.label}`);
  let x = Math.floor(parseInt(element.x) / TWIPS_PER_PIXEL)
  let y = Math.floor(parseInt(element.y) / TWIPS_PER_PIXEL)

  let style = ''
  if (element.backColor) {
    style += `background-color:${element.backColor}; `
  }
  if (element.fontName) {
    style += `font-family:${element.fontName}; `
  }
  if (element.fontBold === 'True') {
    style += 'font-weight:bold; '
  }
  if (element.fontItalic === 'True') {
    style += 'font-style:italic; '
  }
  if (element.fontSize) {
    style += `font-size:${parseInt(element.fontSize)}px; `
  }
  if (element.fontStrikethru === 'True') {
    style += 'text-decoration:line-through; '
  }
  if (element.fontUnderline === 'True') {
    style += 'text-decoration:underline; '
  }
  if (element.foreColor === 'True') {
    style += `color:${element.foreColor}; `
  }

  return {
    "type": "formlabel",
    "label": `${element.label}`,
    "id": nextId++,
    style: `${style}`,
    "_fixed": true,
    "_fixed_x": x,
    "_fixed_y": y,
    "children": []
  }
}

function convertText (element) {
  console.log(`  convertText`, element);
  let x = Math.floor(parseInt(element.x) / TWIPS_PER_PIXEL)
  let y = Math.floor(parseInt(element.y) / TWIPS_PER_PIXEL)
  let w = Math.floor(parseInt(element.width) / TWIPS_PER_PIXEL)
  let h = Math.floor(parseInt(element.height) / TWIPS_PER_PIXEL)

  /*
    {
      "type": "forminput",
      "label": "input",
      "children": [],
      "id": 8205530102,
      "_fixed": true,
      "_fixed_x": 600,
      "_fixed_y": 75,
      "placeholder": "Nice message"
    }
  */
  let style = ''
  let clas = ''
  if (element.backColor && element.backColor !== '#ffffff') {
    style += `background-color:${element.backColor}; `
  }

  // Do we need a border?
  let hasBorder = !(typeof(element.borderStyle) === 'number' && element.borderStyle < 1)

  // See if this is the default styles
  console.log(`${element.fontName}|${element.fontBold}|${element.fontItalic}|${element.fontSize}|${element.foreColor}|${element.backColor}|`);
  if (
    element.fontName === 'Arial'
    &&
    element.fontBold === 'True'
    &&
    element.fontItalic === 'False'
    &&
    element.fontSize === '9.761248'
  ) {
    // Has default styles. We only need to worry about border or not
    clas += hasBorder ? 'form-input-default' : 'form-input-borderless'
  } else {
    if (element.fontName) {
      style += `font-family:${element.fontName}; `
    }
    if (element.fontBold === 'True') {
      style += 'font-weight:bold; '
    }
    if (element.fontItalic === 'True') {
      style += 'font-style:italic; '
    }
    if (element.fontSize) {
      style += `font-size:${parseInt(element.fontSize)}px; `
    }
  }

  // Colors, if not default
  if (element.foreColor !== '#000000') {
    style += `color:${element.foreColor}; `
  }
  if (element.backColor !== '#ffffff') {
    style += `background-color:${element.backColor}; `
  }

  return {
    "type": "forminput",
    "label": `${element.label}`,
    "field": `${element.name}`,
    "id": nextId++,
    style: style,
    class: clas,
    width: w,
    height: h,
    "_fixed": true,
    "_fixed_x": x,
    "_fixed_y": y,
    "placeholder": '',
    "children": []
  }
}

// function convertFrame (element) {
//   // console.log(`  label ${element.label}`);
//   let x = Math.floor(parseInt(element.x) / TWIPS_PER_PIXEL)
//   let y = Math.floor(parseInt(element.y) / TWIPS_PER_PIXEL)
//
//   let style = ''
//   if (element.backColor) {
//     style += `background-color:${element.backColor}; `
//   }
//   if (element.fontName) {
//     style += `font-family:${element.fontName}; `
//   }
//   if (element.fontBold === 'True') {
//     style += 'font-weight:bold; '
//   }
//   if (element.fontItalic === 'True') {
//     style += 'font-style:italic; '
//   }
//   if (element.fontSize) {
//     style += `font-size:${parseInt(element.fontSize)}px; `
//   }
//   if (element.fontStrikethru === 'True') {
//     style += 'text-decoration:line-through; '
//   }
//   if (element.fontUnderline === 'True') {
//     style += 'text-decoration:underline; '
//   }
//   if (element.foreColor === 'True') {
//     style += `color:${element.foreColor}; `
//   }
//
//   return {
//     "type": "formlabel",
//     "label": `${element.label}`,
//     "id": nextId++,
//     style: `${style}`,
//     "_fixed": true,
//     "_fixed_x": x,
//     "_fixed_y": y,
//     "children": []
//   }
// }
