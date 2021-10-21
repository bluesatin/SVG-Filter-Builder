// ┌───────────┐
// │  Imports  │
// ╘═══════════╛
import React from "react";
import svgElements from "data/svg-elements";
import * as InputFields from "components/InputFields";
// ┌─────────────────────────────┐
// │  EditElementForm Component  │
// ╘═════════════════════════════╛
export class EditElementForm extends React.Component {
  // DefaultProps
  static defaultProps = {};
  // Component - FormFields
  get FormFields() {
    // Map of Components by element-type
    const componentMap = {
      "feBlend": <FormFieldsFeBlend />,
      "feColorMatrix": <FormFieldsFeColorMatrix />,
      "feComponentTransfer": <FormFieldsFeComponentTransfer />,
      "feComposite": <FormFieldsFeComposite />,
      "feConvolveMatrix": <FormFieldsFeConvolveMatrix />,
      "feDiffuseLighting": <FormFieldsFeDiffuseLighting />,
      "feDisplacementMap": <FormFieldsFeDisplacementMap />,
      "feDropShadow": <FormFieldsFeDropShadow />,
      "feFlood": <FormFieldsFeFlood />,
      "feFuncR": <FormFieldsFeFunc />,
      "feFuncG": <FormFieldsFeFunc />,
      "feFuncB": <FormFieldsFeFunc />,
      "feFuncA": <FormFieldsFeFunc />,
      "feGaussianBlur": <FormFieldsFeGaussianBlur />,
      "feImage": <FormFieldsFeImage />,
      "feMerge": <FormFieldsFeMerge />,
      "feMergeNode": <FormFieldsFeMergeNode />,
      "feMorphology": <FormFieldsFeMorphology />,
      "feOffset": <FormFieldsFeOffset />,
      "feDistantLight": <FormFieldsFeDistantLight />,
      "fePointLight": <FormFieldsFePointLight />,
      "feSpecularLighting": <FormFieldsFeSpecularLighting />,
      "feSpotLight": <FormFieldsFeSpotLight />,
      "feTile": <FormFieldsFeTile />,
      "feTurbulence": <FormFieldsFeTurbulence />,
    }
    // Generate FormFields component by element-type
    const FormFields = React.cloneElement(componentMap[this.props.element.type], {
      ...this.props,
      "onChange": this.handleChange,
    });
    // Return
    return FormFields;
  }
  // Handler - handleChange
  handleChange = (value, fieldName) => {
    // If changing childElements, call different handler
    if (fieldName === "childElements") {
      this.handleChangeChildElements(value, fieldName);
      return;
    }
    // Get existing field, or create new field
    const newField = this.props.element.attributes?.[fieldName] 
                     ?? { "name": fieldName };
    // Get the value from event, assign to field
    newField.value = value ?? null;
    // Replace field in element
    const newElement = this.props.element;
    newElement.attributes[fieldName] = newField;
    // Pass event up to parent
    this.props.onChangeElement(newElement, newElement.autoId ?? this.props.index);
  }
  // Handler - handleChangeChildElements
  handleChangeChildElements = (childElements) => {
    // Replace old childElements
    const newElement = this.props.element;
    newElement.childElements = childElements;
    // Pass event up to parent
    this.props.onChangeElement(newElement);
  }
  // Handler - handleDeleteElement
  handleDeleteElement = (event) => {
    // Pass event up to parent
    this.props.onDeleteElement(this.props.element.autoId);
  }
  // Render
  render() {
    // If there's no element, don't render anything
    if (!this.props.element) { return null; }
    // Return
    return(
      <React.Fragment>
        <div className="element--form">
          {/* Header - Title */}
          <h3 className="element--header">&lt;{this.props.element.type}&gt;</h3>
          {/* Header -  Buttons */}
          <div className="header--buttons">
            { (this.props.element.url) &&
              <a className="header--link"
                 href={this.props.element.url} target="_blank" rel="noopener noreferrer"
                 title={`MDN Reference for <${this.props.element.type}>`}>
                <button className="header--button">
                  <i className="fas fa-info-circle fa-fw"></i>
                </button>
              </a>
            }
            { (this.props.onDeleteElement) &&
              <button className="header--button"
                      title="Delete Element"
                      onClick={this.handleDeleteElement}>
                <i className="fas fa-trash-alt fa-fw"></i>
              </button> 
            }
          </div>
          <hr className="break" />
          {/* Form Fields */}
          <ul className="element--fields">
            { this.FormFields }
          </ul>
        </div>
      </React.Fragment>  
    );
  }
}
// ┌────────────────────────────────┐
// │  EditElementIdsForm Component  │
// ╘════════════════════════════════╛
export class EditElementIdsForm extends React.Component {
  // DefaultProps
  static defaultProps = {
    "selected": false,
  };
  // Property - idFieldCount
  get idFieldCount() {
    // Map of idFieldCount by element-type
    const idFieldCountMap = {
      "feBlend": 2, "feColorMatrix": 1,
      "feComponentTransfer": 1,
      "feComposite": 2, "feConvolveMatrix": 1,
      "feDiffuseLighting": 1, "feDisplacementMap": 2,
      "feDropShadow": 1, "feFlood": 0,
      "feGaussianBlur": 1, "feImage": 0,
      "feMerge": 0, "feMorphology": 1,
      "feOffset": 1, "feSpecularLighting": 1,
      "feTile": 1, "feTurbulence": 0,
    }
    // Match idFieldCount to element-type
    let idFieldCount = idFieldCountMap?.[this.props.element.type] ?? 0;
    // Return
    return idFieldCount;
  }
  // Handlers - handleSelectionClick
  handleSelectionClick = (event) => {
    // If already selected, do nothing
    if (this.props.selected) { return; }
    // Otherwise, pass event up to parent
    this.props.onSelectElement(this.props.element.autoId);
  }
  // Handler - handleChange
  handleChange = (value, fieldName) => {
    // Get existing field, or create new field
    const newField = this.props.element.attributes?.[fieldName] 
                     ?? { "name": fieldName };
    // Get the value from event, assign to field
    newField.value = value ?? null;
    // Replace field in element
    const newElement = this.props.element;
    newElement.attributes[fieldName] = newField;
    // Pass event up to parent
    this.props.onChangeElement(newElement, this.props.element.autoId);
  }
  // Handlers - handleMoveElement
  handleMoveElement = (moveDirection) => {
    // If no move direction, ignore event
    if (!moveDirection) { return; }
    // Otherwise, pass event up to parent
    this.props.onMoveElement(moveDirection, this.props.element.autoId);
  }
  // Handlers - handleMoveElementUp
  handleMoveElementUp = (event) => { this.handleMoveElement(-1); }
  // Handlers - handleMoveElementDown
  handleMoveElementDown = (event) => { this.handleMoveElement(1); }
  // Render
  render() {
    // Return
    return(
      <React.Fragment>
        <div className={`filter--element ${this.props.selected}`}
             onClick={this.handleSelectionClick}>
          {/* Header - Title */}
          <h3 className="element--header">&lt;{this.props.element.type}&gt;</h3>
          {/* Header -  Buttons */}
          <div className="header--buttons">
            <button className="header--button"
                    title="Move Element Up"
                    onClick={this.handleMoveElementUp}>
              <i className="fas fa-chevron-up fa-fw"></i>
            </button>
            <button className="header--button"
                    title="Move Element Down"
                    onClick={this.handleMoveElementDown}>
              <i className="fas fa-chevron-down fa-fw"></i>
            </button>
          </div>
          <hr className="break" />
          {/* Form Fields */}
          <ul className="element--fields">
            <FormFieldsIds {...this.props}
                           onChange={this.handleChange}
                           result={this.idFieldCount >= 0}
                           in={this.idFieldCount >= 1}
                           in2={this.idFieldCount >= 2} />
          </ul>
        </div>
      </React.Fragment>  
    );
  }
}
// ┌───────────────────────────────┐
// │  FormFieldsFeBlend Component  │
// ╘═══════════════════════════════╛
class FormFieldsFeBlend extends React.Component {
  // DefaultProps
  static defaultProps = {};
  // Property - modeOptions
  modeOptions = [
    "normal", 
    "————", "darken", "multiply", "color-burn", 
    "————", "lighten", "screen", "color-dodge", 
    "————", "overlay", "soft-light", "hard-light", 
    "————", "difference", "exclusion", 
    "————", "hue", "saturation", "color", "luminosity", 
  ];
  // Render
  render() {
    // Return
    return(
      <React.Fragment>
        <FormFieldsIds {...this.props} 
                       result={true}
                       in={true} 
                       in2={true} />
        <li className={`element--field`} key={`mode`}>
          <InputFields.ListInput name="mode"
                                 value={this.props.element.attributes?.mode?.value}
                                 options={this.modeOptions}
                                 onChange={this.props.onChange} />
        </li>
        <li className={`element--field`} key={`color-interpolation-filters`}>
          <InputFields.ListInput name="color-interpolation-filters"
                                 label="color-interpolation-mode"
                                 value={this.props.element.attributes?.["color-interpolation-filters"]?.value}
                                 options={["linearRGB","sRGB"]}
                                 onChange={this.props.onChange} />
        </li>
        <FormFieldsPosition {...this.props} />
      </React.Fragment>
    );
  }
}
// ┌─────────────────────────────────────┐
// │  FormFieldsFeColorMatrix Component  │
// ╘═════════════════════════════════════╛
class FormFieldsFeColorMatrix extends React.Component {
  // DefaultProps
  static defaultProps = {};
  // Handler - TypeChange
  handleTypeChange = (value, fieldName) => {
    // Defaults for the 'values' field
    const valuesFieldDefaults = {
      "matrix": "1 0 0 0 0\n0 1 0 0 0\n0 0 1 0 0\n0 0 0 1 0",
      "saturate": 1,
      "hueRotate": 0,
    }
    // Reset values field, and pass change of type up to parent
    this.props.onChange(valuesFieldDefaults[value] ?? null, "values");
    this.props.onChange(value, fieldName);
  }
  // Render
  render() {
    // Return
    return(
      <React.Fragment>
        <FormFieldsIds {...this.props} 
                       result={true}
                       in={true} />
        <li className={`element--field`} key={`type`}>
          <InputFields.ListInput name="type"
                                 value={this.props.element.attributes?.type?.value}
                                 options={["matrix", "saturate",
                                           "hueRotate", "luminanceToAlpha"]}
                                 onChange={this.handleTypeChange} />
        </li>
        { (this.props.element.attributes?.type?.value === "matrix") &&
        <li className={`element--field`} key={`values`}>
          <InputFields.MatrixInput name="values"
                                   value={this.props.element.attributes?.values?.value}
                                   grid="4x5"
                                   rowLabels={["R", "G", "B", "A"]}
                                   colLabels={["R", "G", "B", "A", "W"]}
                                   onChange={this.props.onChange} />
        </li>
        }
        { (this.props.element.attributes?.type?.value === "saturate") &&
        <li className={`element--field`} key={`values`}>
          <InputFields.NumberInput name="values"
                                   value={this.props.element.attributes?.values?.value
                                          ?? 1}
                                   range={true}
                                   min="0" max="2" step="0.05"
                                   onChange={this.props.onChange} />
        </li>
        }
        { (this.props.element.attributes?.type?.value === "hueRotate") &&
        <li className={`element--field`} key={`values`}>
          <InputFields.NumberInput name="values"
                                   value={this.props.element.attributes?.values?.value
                                          ?? 0}
                                   range={true}
                                   min="0" max="360" step="5"
                                   onChange={this.props.onChange} />
        </li>
        }
        <FormFieldsPosition {...this.props} />
      </React.Fragment>
    );
  }
}
// ┌───────────────────────────────────────────┐
// │  FormFieldsFeComponentTransfer Component  │
// ╘═══════════════════════════════════════════╛
class FormFieldsFeComponentTransfer extends React.Component {
  // DefaultProps
  static defaultProps = {};
  // Render
  render() {
    // Return
    return(
      <React.Fragment>
        <FormFieldsIds {...this.props} 
                       result={true}
                       in={true} />
        <FormFieldsPosition {...this.props} />
        <FormFieldsChildElements childElements={this.props.element?.childElements}
                                 label="components"
                                 fixedChildElements="true"
                                 onChange={this.props.onChange} />
      </React.Fragment>
    );
  }
}
// ┌───────────────────────────────────┐
// │  FormFieldsFeComposite Component  │
// ╘═══════════════════════════════════╛
class FormFieldsFeComposite extends React.Component {
  // DefaultProps
  static defaultProps = {};
  // Handler - handleOperatorChange
  handleOperatorChange = (value, fieldName) => {
    // If operator is arithmetic, set K fields to defaults
    if (value === "arithmetic") {
      this.props.onChange(svgElements?.feComposite?.attributes?.k1?.value ?? 0, "k1");
      this.props.onChange(svgElements?.feComposite?.attributes?.k2?.value ?? 0, "k2");
      this.props.onChange(svgElements?.feComposite?.attributes?.k3?.value ?? 0, "k3");
      this.props.onChange(svgElements?.feComposite?.attributes?.k4?.value ?? 0, "k4");
    }
    // Otherwise, clear K fields
    else {
      this.props.onChange(null, "k1");
      this.props.onChange(null, "k2");
      this.props.onChange(null, "k3");
      this.props.onChange(null, "k4");
    }
    // Pass change of operator up to parent
    this.props.onChange(value, fieldName);
  }
  // Render
  render() {
    // Return
    return(
      <React.Fragment>
        <FormFieldsIds {...this.props} 
                       result={true}
                       in={true}
                       in2={true} />
        <li className={`element--field`} key={`operator`}>
          <InputFields.ListInput name="operator"
                                 value={this.props.element.attributes?.operator?.value}
                                 options={["over", "in", "out",
                                           "atop", "xor", "lighter",
                                           "arithmetic"]}
                                 onChange={this.handleOperatorChange} />
        </li>
        { (this.props.element.attributes?.operator?.value === "arithmetic") &&
          <li className={`element--field`} key={`k1_k2_k3_k4`}>
            <InputFields.NumberInput name="k1"
                                     value={this.props.element.attributes?.k1?.value}
                                     step="0.1"
                                     onChange={this.props.onChange} />
            <InputFields.NumberInput name="k2"
                                     value={this.props.element.attributes?.k2?.value}
                                     onChange={this.props.onChange} />
            <InputFields.NumberInput name="k3"
                                     value={this.props.element.attributes?.k3?.value}
                                     onChange={this.props.onChange} />
            <InputFields.NumberInput name="k4"
                                     value={this.props.element.attributes?.k4?.value}
                                     onChange={this.props.onChange} />
          </li>
        }
        <li className={`element--field`} key={`color-interpolation-filters`}>
          <InputFields.ListInput name="color-interpolation-filters"
                                 label="color-interpolation-mode"
                                 value={this.props.element.attributes?.["color-interpolation-filters"]?.value}
                                 options={["linearRGB","sRGB"]}
                                 onChange={this.props.onChange} />
        </li>
        <FormFieldsPosition {...this.props} />
      </React.Fragment>
    );
  }
}
// ┌────────────────────────────────────────┐
// │  FormFieldsFeConvolveMatrix Component  │
// ╘════════════════════════════════════════╛
class FormFieldsFeConvolveMatrix extends React.Component {
  // DefaultProps
  static defaultProps = {};
  // Render
  render() {
    // Return
    return(
      <React.Fragment>
        <FormFieldsIds {...this.props} 
                       result={true}
                       in={true} />
        <li className={`element--field`} key={`order`}>
          <InputFields.NumberInput name="order"
                                   value={this.props.element.attributes?.order?.value}
                                   range={true}
                                   int={true}
                                   min="1" max="9" step="1"
                                   onChange={this.props.onChange} />
        </li>
        <li className={`element--field`} key={`kernelMatrix`}>
          <InputFields.MatrixInput name="kernelMatrix"
                                   grid={this.props.element.attributes?.order?.value + "x" +
                                         this.props.element.attributes?.order?.value}
                                   value={this.props.element.attributes?.kernelMatrix?.value}
                                   onChange={this.props.onChange} />
        </li>
        <li className={`element--field`} key={`divisor`}>
          <InputFields.NumberInput name="divisor"
                                   value={this.props.element.attributes?.divisor?.value}
                                   onChange={this.props.onChange} />
        </li>
        <li className={`element--field`} key={`bias`}>
          <InputFields.NumberInput name="bias"
                                   value={this.props.element.attributes?.bias?.value}
                                   onChange={this.props.onChange} />
        </li>
        <li className={`element--field`} key={`targetX_targetY`}>
          <InputFields.NumberInput name="targetX"
                                   value={this.props.element.attributes?.targetX?.value}
                                   onChange={this.props.onChange} />
          <InputFields.NumberInput name="targetY"
                                   value={this.props.element.attributes?.targetY?.value}
                                   onChange={this.props.onChange} />
        </li>
        <li className={`element--field`} key={`edgeMode`}>
          <InputFields.ListInput name="edgeMode"
                                   value={this.props.element.attributes?.edgeMode?.value}
                                   options={["duplicate", "wrap", "none"]}
                                   onChange={this.props.onChange} />
        </li>
        <li className={`element--field`} key={`preserveAlpha`}>
          <InputFields.BooleanInput name="preserveAlpha"
                                    tristate={true}
                                    value={this.props.element.attributes?.preserveAlpha?.value}
                                    onChange={this.props.onChange} />
        </li>
        <FormFieldsPosition {...this.props} />
      </React.Fragment>
    );
  }
}
// ┌─────────────────────────────────────────┐
// │  FormFieldsFeDiffuseLighting Component  │
// ╘═════════════════════════════════════════╛
class FormFieldsFeDiffuseLighting extends React.Component {
  // DefaultProps
  static defaultProps = {};
  // Render
  render() {
    // Return
    return(
      <React.Fragment>
        <FormFieldsIds {...this.props} 
                       result={true}
                       in={true} />
        <li className={`element--field`} key={`surfaceScale`}>
          <InputFields.NumberInput name="surfaceScale"
                                   value={this.props.element.attributes?.surfaceScale?.value}
                                   onChange={this.props.onChange} />
        </li>
        <li className={`element--field`} key={`diffuseConstant`}>
          <InputFields.NumberInput name="diffuseConstant"
                                   value={this.props.element.attributes?.diffuseConstant?.value}
                                   step="0.1"
                                   onChange={this.props.onChange} />
        </li>
        <FormFieldsPosition {...this.props} />
        <FormFieldsChildElements childElements={this.props.element.childElements}
                                 label="lights"
                                 options={["feDistantLight", "fePointLight", "feSpotLight"]}
                                 onChange={this.props.onChange} />
      </React.Fragment>
    );
  }
}
// ┌─────────────────────────────────────────┐
// │  FormFieldsFeDisplacementMap Component  │
// ╘═════════════════════════════════════════╛
class FormFieldsFeDisplacementMap extends React.Component {
  // DefaultProps
  static defaultProps = {};
  // Render
  render() {
    // Return
    return(
      <React.Fragment>
        <FormFieldsIds {...this.props} 
                       result={true}
                       in={true}
                       in2={true} />
        <li className={`element--field`} key={`scale`}>
          <InputFields.NumberInput name="scale"
                                   value={this.props.element.attributes?.scale?.value}
                                   onChange={this.props.onChange} />
        </li>
        <li className={`element--field`} key={`xChannelSelector_yChannelSelector`}>
          <InputFields.ListInput name="xChannelSelector"
                                 value={this.props.element.attributes?.xChannelSelector?.value}
                                 options={["R", "G", "B", "A"]}
                                 onChange={this.props.onChange} />
          <InputFields.ListInput name="yChannelSelector"
                                 value={this.props.element.attributes?.yChannelSelector?.value}
                                 options={["R", "G", "B", "A"]}
                                 onChange={this.props.onChange} />
        </li>
        <FormFieldsPosition {...this.props} />
      </React.Fragment>
    );
  }
}
// ┌────────────────────────────────────┐
// │  FormFieldsFeDropShadow Component  │
// ╘════════════════════════════════════╛
class FormFieldsFeDropShadow extends React.Component {
  // DefaultProps
  static defaultProps = {};
  // Render
  render() {
    // Return
    return(
      <React.Fragment>
        <FormFieldsIds {...this.props} 
                       result={true} 
                       in={true} />
        <li className={`element--field`} key={`dx_dy`}>
          <InputFields.NumberInput name="dx"
                                   value={this.props.element.attributes?.dx?.value}
                                   onChange={this.props.onChange} />
          <InputFields.NumberInput name="dy"
                                   value={this.props.element.attributes?.dy?.value}
                                   onChange={this.props.onChange} />
        </li>
        <li className={`element--field`} key={`stdDeviation`}>
          <InputFields.NumberInput name="stdDeviation"
                                   value={this.props.element.attributes?.stdDeviation?.value}
                                   onChange={this.props.onChange} />
        </li>
        <FormFieldsPosition {...this.props} />
      </React.Fragment>
    );
  }
}
// ┌───────────────────────────────┐
// │  FormFieldsFeFlood Component  │
// ╘═══════════════════════════════╛
class FormFieldsFeFlood extends React.Component {
  // DefaultProps
  static defaultProps = {};
  // Render
  render() {
    // Return
    return(
      <React.Fragment>
        <FormFieldsIds {...this.props}
                       result={true} />
        <li className={`element--field`} key={`flood-color`}>
          <InputFields.ColorInput name="flood-color"
                                  value={this.props.element.attributes["flood-color"].value}
                                  onChange={this.props.onChange} />
        </li>
        <li className={`element--field`} key={`flood-opacity`}>
          <InputFields.NumberInput name="flood-opacity"
                                   range={true}
                                   min="0" max="1" step="0.01"
                                   value={this.props.element.attributes["flood-opacity"].value}
                                   onChange={this.props.onChange} />
        </li>
        <FormFieldsPosition {...this.props} />
      </React.Fragment>
    );
  }
}
// ┌──────────────────────────────────────┐
// │  FormFieldsFeGaussianBlur Component  │
// ╘══════════════════════════════════════╛
class FormFieldsFeGaussianBlur extends React.Component {
  // DefaultProps
  static defaultProps = {};  
  // Render
  render() {
    // Return
    return(
      <React.Fragment>
        <FormFieldsIds {...this.props}
                       result={true}
                       in={true} />
        <li className={`element--field`} key={`stdDeviation`}>
          <InputFields.NumberInput name="stdDeviation"
                                   value={this.props.element.attributes?.stdDeviation?.value}
                                   onChange={this.props.onChange} />
        </li>
        <li className={`element--field`} key={`edgeMode`}>
          <InputFields.ListInput name="edgeMode"
                                 value={this.props.element.attributes?.edgeMode?.value}
                                 options={["duplicate", "wrap", "none"]}
                                 onChange={this.props.onChange} />
        </li>
        <FormFieldsPosition {...this.props} />
      </React.Fragment>
    );
  }
}
// ┌───────────────────────────────┐
// │  FormFieldsFeImage Component  │
// ╘═══════════════════════════════╛
class FormFieldsFeImage extends React.Component {
  // DefaultProps
  static defaultProps = {};
  // Property - preserveAspectRatioAlign
  get preserveAspectRatioAlign() {
    // Retrieve alignment value from string
    const baseValue = this.props.element.attributes.preserveAspectRatio.value ?? "";
    return baseValue.match(/(none|(?:[x](?:Min|Mid|Max)[y](?:Min|Mid|Max)))/i)?.[1] ?? "";
  }
  // Property - preserveAspectRatioCrop
  get preserveAspectRatioCrop() {
    // Retrieve alignment value from string
    const baseValue = this.props.element.attributes.preserveAspectRatio.value ?? "";
    return baseValue.match(/(meet|slice)/i)?.[1] ?? "";
  }
  // Handler - handleAspectRatioChange
  handleAspectRatioChange = (value, fieldName) => {
    // Combine fields
    let newValue = "";
    if (fieldName === "aspectRatioAlign") {
      newValue = `${value} ${this.preserveAspectRatioCrop}`;
    }
    else if (fieldName === "aspectRatioCrop") {
      newValue = `${this.preserveAspectRatioAlign} ${value}`;
    }
    newValue = newValue.trim();
    // Pass update to parent
    this.props.onChange(newValue, "preserveAspectRatio");
  }
  // Render
  render() {
    // Return
    return(
      <React.Fragment>
        <FormFieldsIds {...this.props}
                       result={true} />
        <li className={`element--field`} key={`href`}>
          <InputFields.TextInput name="href"
                                 value={this.props.element.attributes?.href?.value}
                                 onChange={this.props.onChange} />
        </li>
        <li className={`element--field`} key={`preserveAspectRatio`}>
          <InputFields.ListInput name="aspectRatioAlign"
                                 value={this.preserveAspectRatioAlign}
                                 options={["none",
                                           "xMinYMin", "xMidYMin", "xMaxYMin",
                                           "xMinYMid", "xMidYMid", "xMaxYMid",
                                           "xMinYMax", "xMidYMax", "xMaxYMax"]}
                                 onChange={this.handleAspectRatioChange} />
          <InputFields.ListInput name="aspectRatioCrop"
                                 value={this.preserveAspectRatioCrop}
                                 options={["meet", "slice"]}
                                 onChange={this.handleAspectRatioChange} />
        </li>
        <FormFieldsPosition {...this.props} />
      </React.Fragment>
    );
  }
}
// ┌───────────────────────────────┐
// │  FormFieldsFeMerge Component  │
// ╘═══════════════════════════════╛
class FormFieldsFeMerge extends React.Component {
  // DefaultProps
  static defaultProps = {};
  // Render
  render() {
    // Return
    return(
      <React.Fragment>
        <FormFieldsIds {...this.props}
                       result={true} />
        <FormFieldsPosition {...this.props} />
        <FormFieldsChildElements childElements={this.props.element.childElements}
                                 label="nodes"
                                 elementIds={this.props.elementIds}
                                 value="feMergeNode"
                                 options={["feMergeNode"]}
                                 onChange={this.props.onChange} />
      </React.Fragment>
    );
  }
}
// ┌────────────────────────────────────┐
// │  FormFieldsFeMorphology Component  │
// ╘════════════════════════════════════╛
class FormFieldsFeMorphology extends React.Component {
  // DefaultProps
  static defaultProps = {};
  // Render
  render() {
    // Return
    return(
      <React.Fragment>
        <FormFieldsIds {...this.props}
                       result={true}
                       in={true} />
        <li className={`element--field`} key={`operator`}>
          <InputFields.ListInput name="operator"
                                 value={this.props.element.attributes?.operator?.value}
                                 options={["erode", "dilate"]}
                                 onChange={this.props.onChange} />
        </li>
        <li className={`element--field`} key={`radius`}>
          <InputFields.NumberInput name="radius"
                                   value={this.props.element.attributes?.radius?.value}
                                   onChange={this.props.onChange} />
        </li>
        <FormFieldsPosition {...this.props} />
      </React.Fragment>
    );
  }
}
// ┌────────────────────────────────┐
// │  FormFieldsFeOffset Component  │
// ╘════════════════════════════════╛
class FormFieldsFeOffset extends React.Component {
  // DefaultProps
  static defaultProps = {};
  // Render
  render() {
    // Return
    return(
      <React.Fragment>
        <FormFieldsIds {...this.props}
                       result={true}
                       in={true} />
        <li className={`element--field`} key={`dx_dy`}>
          <InputFields.NumberInput name="dx"
                                   value={this.props.element.attributes?.dx?.value}
                                   onChange={this.props.onChange} />
          <InputFields.NumberInput name="dy"
                                   value={this.props.element.attributes?.dy?.value}
                                   onChange={this.props.onChange} />
        </li>
        <FormFieldsPosition {...this.props} />
      </React.Fragment>
    );
  }
}
// ┌──────────────────────────────────────────┐
// │  FormFieldsFeSpecularLighting Component  │
// ╘══════════════════════════════════════════╛
class FormFieldsFeSpecularLighting extends React.Component {
  // DefaultProps
  static defaultProps = {};
  // Render
  render() {
    // Return
    return(
      <React.Fragment>
        <FormFieldsIds {...this.props}
                       result={true}
                       in={true} />
        <li className={`element--field`} key={`surfaceScale`}>
          <InputFields.NumberInput name="surfaceScale"
                                   value={this.props.element.attributes?.surfaceScale?.value}
                                   onChange={this.props.onChange} />
        </li>
        <li className={`element--field`} key={`specularConstant`}>
          <InputFields.NumberInput name="specularConstant"
                                   value={this.props.element.attributes?.specularConstant?.value}
                                   step="0.1"
                                   onChange={this.props.onChange} />
        </li>
        <li className={`element--field`} key={`specularExponent`}>
          <InputFields.NumberInput name="specularExponent"
                                   value={this.props.element.attributes?.specularExponent?.value}
                                   step="1"
                                   onChange={this.props.onChange} />
        </li>
        <FormFieldsPosition {...this.props} />
        <FormFieldsChildElements childElements={this.props.element.childElements}
                                 label="lights"
                                 options={["feDistantLight", "fePointLight", "feSpotLight"]}
                                 onChange={this.props.onChange} />
      </React.Fragment>
    );
  }
}
// ┌──────────────────────────────┐
// │  FormFieldsFeTile Component  │
// ╘══════════════════════════════╛
class FormFieldsFeTile extends React.Component {
  // DefaultProps
  static defaultProps = {};
  // Render
  render() {
    // Return
    return(
      <React.Fragment>
        <FormFieldsIds {...this.props} 
                       result={true}
                       in={true} />
        <FormFieldsPosition {...this.props} />
      </React.Fragment>
    );
  }
}
// ┌────────────────────────────────────┐
// │  FormFieldsFeTurbulence Component  │
// ╘════════════════════════════════════╛
class FormFieldsFeTurbulence extends React.Component {
  // DefaultProps
  static defaultProps = {};
  // Property - baseFrequencyX
  get baseFrequencyX() {
    // Retrieve frequency values from string
    const baseValue = this.props.element.attributes.baseFrequency.value.toString() ?? "";
    return baseValue.match(/^([\d.]+)/)?.[1] ?? "";
  }
  // Property - baseFrequencyY
  get baseFrequencyY() {
    // Retrieve frequency values from string
    const baseValue = this.props.element.attributes.baseFrequency.value.toString() ?? "";
    return baseValue.match(/^[\d.]+[\s]+([\d.]+)/)?.[1] ?? "";
  }
  // Handler - handleBaseFrequencyChange
  handleBaseFrequencyChange = (value, fieldName) => {
    // Combine fields
    let newValue = "";
    if (fieldName === "baseFrequencyX") {
      newValue = `${value} ${this.baseFrequencyY}`;
    }
    else if (fieldName === "baseFrequencyY") {
      newValue = `${this.baseFrequencyX} ${value}`;
    }
    newValue = newValue.trim();
    // Pass update to parent
    this.props.onChange(newValue, "baseFrequency");
  }
  // Render
  render() {
    // Return
    return(
      <React.Fragment>
        <FormFieldsIds {...this.props} 
                       result={true} />
          <li className={`element--field`} key={`seed`}>
            <InputFields.NumberInput name="seed"
                                     value={this.props.element.attributes?.seed?.value}
                                     onChange={this.props.onChange} />
          </li>
          <li className={`element--field`} key={`type`}>
            <InputFields.ListInput name="type"
                                   value={this.props.element.attributes?.type?.value}
                                   options={["turbulence", "fractalNoise"]}
                                   onChange={this.props.onChange} />
          </li>
          <li className={`element--field`} key={`numOctaves`}>
            <InputFields.NumberInput name="numOctaves"
                                     value={this.props.element.attributes?.numOctaves?.value}
                                     int={true}
                                     onChange={this.props.onChange} />
          </li>
          <li className={`element--field`} key={`baseFrequencyX_baseFrequencyY`}>
            <InputFields.NumberInput name="baseFrequencyX"
                                     value={this.baseFrequencyX}
                                     range={true}
                                     min="0" max="1" step="0.005"
                                     onChange={this.handleBaseFrequencyChange} />
            <InputFields.NumberInput name="baseFrequencyY"
                                     value={this.baseFrequencyY}
                                     range={true}
                                     min="0" max="1" step="0.005"
                                     onChange={this.handleBaseFrequencyChange} />
          </li>
          <li className={`element--field`} key={`stitchTiles`}>
            <InputFields.ListInput name="stitchTiles"
                                   value={this.props.element.attributes?.stitchTiles?.value}
                                   options={["noStitch","stitch"]}
                                   onChange={this.props.onChange} />
          </li>
        <FormFieldsPosition {...this.props} />
      </React.Fragment>
    );
  }
}
// ┌──────────────────────────────────────┐
// │  FormFieldsFeDistantLight Component  │
// ╘══════════════════════════════════════╛
class FormFieldsFeDistantLight extends React.Component {
  // DefaultProps
  static defaultProps = {};
  // Render
  render() {
    // Return
    return(
      <React.Fragment>
        <li className={`element--field`} key={`azimuth`}>
          <InputFields.NumberInput name="azimuth"
                                   value={this.props.element.attributes?.azimuth?.value
                                          ?? 225}
                                   range={true}
                                   min="0" max="360" step="15"
                                   onChange={this.props.onChange} />
        </li>
        <li className={`element--field`} key={`elevation`}>
          <InputFields.NumberInput name="elevation"
                                   value={this.props.element.attributes?.elevation?.value
                                          ?? 45}
                                   range={true}
                                   min="0" max="90" step="5"
                                   onChange={this.props.onChange} />
        </li>
      </React.Fragment>
    );
  }
}
// ┌────────────────────────────────────┐
// │  FormFieldsFePointLight Component  │
// ╘════════════════════════════════════╛
class FormFieldsFePointLight extends React.Component {
  // DefaultProps
  static defaultProps = {};
  // Render
  render() {
    // Return
    return(
      <React.Fragment>
        <FormFieldsPosition {...this.props}
                            x={true} y={true} z={true}
                            width={false} height={false} />
      </React.Fragment>
    );
  }
}
// ┌───────────────────────────────────┐
// │  FormFieldsFeSpotLight Component  │
// ╘═══════════════════════════════════╛
class FormFieldsFeSpotLight extends React.Component {
  // DefaultProps
  static defaultProps = {};
  // Render
  render() {
    // Return
    return(
      <React.Fragment>
        <li className={`element--field`} key={`specularExponent`}>
          <InputFields.NumberInput name="specularExponent"
                                   value={this.props.element.attributes?.specularExponent?.value}
                                   onChange={this.props.onChange} />
        </li>
        <FormFieldsPosition {...this.props}
                            x={true} y={true} z={true}
                            width={false} height={false} />
        <li className={`element--field`} key={`pointsAtX_pointsAtY_pointsAtZ`}>
          <InputFields.NumberInput name="pointsAtX"
                                   value={this.props.element.attributes?.pointsAtX?.value}
                                   onChange={this.props.onChange} />
          <InputFields.NumberInput name="pointsAtY"
                                   value={this.props.element.attributes?.pointsAtY?.value}
                                   onChange={this.props.onChange} />
          <InputFields.NumberInput name="pointsAtZ"
                                   value={this.props.element.attributes?.pointsAtZ?.value}
                                   onChange={this.props.onChange} />
        </li>
        <li className={`element--field`} key={`limitingConeAngle`}>
          <InputFields.NumberInput name="limitingConeAngle"
                                   value={this.props.element.attributes?.limitingConeAngle?.value}
                                   range={true}
                                   min="0" max="180" step="5"
                                   onChange={this.props.onChange} />
        </li>
      </React.Fragment>
    );
  }
}
// ┌───────────────────────────────────┐
// │  FormFieldsFeMergeNode Component  │
// ╘═══════════════════════════════════╛
class FormFieldsFeMergeNode extends React.Component {
  // DefaultProps
  static defaultProps = {};
  // Render
  render() {
    // Return
    return(
      <React.Fragment>
        <FormFieldsIds {...this.props} 
                       result={false}
                       in={true} />
      </React.Fragment>
    );
  }
}
// ┌──────────────────────────────┐
// │  FormFieldsFeFunc Component  │
// ╘══════════════════════════════╛
class FormFieldsFeFunc extends React.Component {
  // DefaultProps
  static defaultProps = {};
  // Handler - handleTypeChange
  handleTypeChange = (value, fieldName) => {
    // Initialise
    const oldType = this.props.element.attributes?.type?.value;
    // Clear the fields of the old 'type' we're changing from
    if (oldType === "table" || oldType === "discrete") {
      this.props.onChange(null, "tableValues");
    }
    else if (oldType === "linear") {
      this.props.onChange(null, "slope");
      this.props.onChange(null, "intercept");
    }
    else if (oldType === "gamma") {
      this.props.onChange(null, "amplitude");
      this.props.onChange(null, "exponent");
      this.props.onChange(null, "offset");
    }
    // Pass change of 'type' up to parent
    this.props.onChange(value, fieldName);
  }
  // Render
  render() {
    // Return
    return(
      <React.Fragment>
          <li className={`element--field`} key={`type`}>
            <InputFields.ListInput name="type"
                                   value={this.props.element.attributes?.type?.value}
                                   options={["identity", 
                                             "table", "discrete",
                                             "linear", "gamma"]}
                                   onChange={this.handleTypeChange} />
          </li>
          { (this.props.element.attributes?.type?.value === "table"
             || this.props.element.attributes?.type?.value === "discrete") &&
          <React.Fragment>
            <li className={`element--field`} key={`tableValues`}>
              <InputFields.TextInput name="tableValues"
                                     value={this.props.element.attributes?.tableValues?.value}
                                     onChange={this.props.onChange} />
            </li>
          </React.Fragment>
          }
          { (this.props.element.attributes?.type?.value === "linear") &&
          <React.Fragment>
            <li className={`element--field`} key={`slope`}>
              <InputFields.TextInput name="slope"
                                     value={this.props.element.attributes?.slope?.value}
                                     onChange={this.props.onChange} />
            </li>
            <li className={`element--field`} key={`intercept`}>
              <InputFields.TextInput name="intercept"
                                     value={this.props.element.attributes?.intercept?.value}
                                     onChange={this.props.onChange} />
            </li>
          </React.Fragment>
          }
          { (this.props.element.attributes?.type?.value === "gamma") &&
          <React.Fragment>
            <li className={`element--field`} key={`amplitude`}>
              <InputFields.NumberInput name="amplitude"
                                       value={this.props.element.attributes?.amplitude?.value}
                                       onChange={this.props.onChange} />
            </li>
            <li className={`element--field`} key={`exponent`}>
              <InputFields.NumberInput name="exponent"
                                       value={this.props.element.attributes?.exponent?.value}
                                       onChange={this.props.onChange} />
            </li>
            <li className={`element--field`} key={`offset`}>
              <InputFields.NumberInput name="offset"
                                       value={this.props.element.attributes?.offset?.value}
                                       onChange={this.props.onChange} />
            </li>
          </React.Fragment>
          }
      </React.Fragment>
    );
  }
}
// ┌────────────────────────────┐
// │  FormFieldsIds Components  │
// ╘════════════════════════════╛
// e.g. result, in, in2
export class FormFieldsIds extends React.Component {
  // DefaultProps
  static defaultProps = {
    "result": false,
        "in": false,
       "in2": false,
  };
  // Render
  render() {
    // Remove current element's ID from elementId list
    const elementIds = [...this.props.elementIds];
    let findIndex = elementIds.findIndex(id => id === this.props.element.autoId);
    if (findIndex >= 0) { elementIds.splice(findIndex, 1); }
    // Return
    return(
      <React.Fragment>
        { (this.props.result) && 
          <li className={`element--field`} key={`result`}>
            <InputFields.IdInput name="result"
                                 value={this.props.element.attributes?.result?.value}
                                 onChange={this.props.onChange} />
          </li>
        }
        { (this.props.in) && 
          <li className={`element--field`} key={`in`}>
            <InputFields.IdInput name="in"
                                 value={this.props.element.attributes?.in?.value}
                                 options={["SourceGraphic", "SourceAlpha", 
                                           "BackgroundImage", "BackgroundAlpha", 
                                           "FillPaint", "StrokePaint", "————"]}
                                 elementIds={elementIds}
                                 onChange={this.props.onChange} />
          </li>
        }
        { (this.props.in2) && 
          <li className={`element--field`} key={`in2`}>
            <InputFields.IdInput name="in2"
                                 value={this.props.element.attributes?.in2?.value}
                                 options={["SourceGraphic", "SourceAlpha", 
                                           "BackgroundImage", "BackgroundAlpha", 
                                           "FillPaint", "StrokePaint", "————"]}
                                 elementIds={elementIds}
                                 onChange={this.props.onChange} />
          </li>
        }
      </React.Fragment>
    );
  }
}
// ┌─────────────────────────────────┐
// │  FormFieldsPosition Components  │
// ╘═════════════════════════════════╛
// e.g. width, height, x, y
export class FormFieldsPosition extends React.Component {
  // DefaultProps
  static defaultProps = {
    "width": true,
    "height": true,
    "x": true,
    "y": true,
    "z": false,
  }; 
  // Render
  render() {
    // Return
    return(
      <React.Fragment>
        { (this.props.width || this.props.height) &&
          <li className={`element--field`} key={`width_height`}>
              { (this.props.width) && 
                <InputFields.NumberInput name="width"
                                         value={this.props.element.attributes?.width?.value}
                                         onChange={this.props.onChange} /> }
              { (this.props.height) && 
                <InputFields.NumberInput name="height"
                                         value={this.props.element.attributes?.height?.value}
                                         onChange={this.props.onChange} /> }
          </li>
        }
        { (this.props.x || this.props.y) &&
          <li className={`element--field`} key={`x_y_z`}>
              { (this.props.x) && 
                <InputFields.NumberInput name="x"
                                         value={this.props.element.attributes?.x?.value}
                                         onChange={this.props.onChange} /> }
              { (this.props.y) && 
                <InputFields.NumberInput name="y"
                                         value={this.props.element.attributes?.y?.value}
                                         onChange={this.props.onChange} /> }
              { (this.props.z) && 
                <InputFields.NumberInput name="z"
                                         value={this.props.element.attributes?.z?.value}
                                         onChange={this.props.onChange} /> }
              
          </li>
        }
      </React.Fragment>
    );
  }
}
// ┌──────────────────────────────────────┐
// │  FormFieldsChildElements Components  │
// ╘══════════════════════════════════════╛
// e.g. <feMergeNode> etc.
export class FormFieldsChildElements extends React.Component {
  // DefaultProps
  static defaultProps = {
    "label": "child elements",
    "fixedChildElements": false,
  };
  // State
  state = {
    newElementType: this.props.value ?? "",
  };
  // Handlers - handleNewElementTypeChange
  handleNewElementTypeChange = (event) => {
    this.setState({ newElementType: event.target.value });
  }
    // Handler - Add New Element
  handleAddNewElement = (elementType) => {
    // Update State
    this.setState(prevState => {
      // Deep clone the base element data
      let newElement = svgElements[elementType];
      newElement = JSON.parse(JSON.stringify(newElement));
      // Add the new element to element-list
      prevState.elements.push(newElement);
      // Return modified element-list
      return ({ "elements": [...prevState.elements] });
    });
  }
  // Handlers - handleAddNewElement
  handleAddNewElement = (event) => {
    // If there's no element selected, do nothing
    if (!this.state.newElementType) { return; }
    // Deep clone the base element data
    let newElement = svgElements[this.state.newElementType];
    newElement = JSON.parse(JSON.stringify(newElement));
    // Add to existing childElements
    const newChildElements = this.props.childElements ?? [];
    newChildElements.push(newElement);
    // Pass event to parent
    this.props.onChange(newChildElements, "childElements");
  }
  // Handlers - handleChangeElement
  handleChangeElement = (element, index) => {
      // Replace changed element in childElements
      const newChildElements = this.props.childElements;
      newChildElements[index] = element;
      // Pass event to parent
      this.props.onChange(newChildElements, "childElements");
  }
  // Handler - handleDeleteElement
  handleDeleteElement = (elementIndex) => {
      // Remove element from childElements
      const newChildElements = this.props.childElements;
      newChildElements.splice(elementIndex, 1);
      // Pass event to parent
      this.props.onChange(newChildElements, "childElements");
  }
  // Render
  render() {
    // Return
    return(
      <React.Fragment>
        <li className="element--field">
          <div className="field--container">
            <label className="field--label">
              {this.props.label}
            </label>
            <hr className="break" />
            <div className="filter--elements">
              { (this.props.childElements) &&
                this.props.childElements.map((element, index) => (
                  <EditElementForm key={index}
                                   index={index}
                                   element={element}
                                   elementIds={this.props.elementIds}
                                   onChangeElement={this.handleChangeElement}
                                   onDeleteElement={ this.props.fixedChildElements ?
                                                     false : this.handleDeleteElement }
                                   onMoveElement={this.props.onMoveElement} />
              ))}
            </div>
            { (this.props.options) &&
              <div className="filter--footer">
                <select value={this.state.newElementType} onChange={this.handleNewElementTypeChange}>
                  <option value="" />
                  { 
                    this.props.options.map((elementType, i) => 
                      <option key={i} value={elementType}>&lt;{elementType}&gt;</option>
                    )
                  }
                </select>
                <button className="" title="Add Filter Element" onClick={this.handleAddNewElement}>
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            }
          </div>
        </li>
      </React.Fragment>
    );
  }
}
// ┌──────────┐
// │  Export  │
// ╘══════════╛
export default EditElementForm;
