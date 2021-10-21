// ┌───────────┐
// │  Imports  │
// ╘═══════════╛
import React from "react"; //React
// import ReactDOM from "react-dom";
import { LinePath, CurvyPath, SquarePath } from "svg-dom-arrows";
// ┌─────────────────────────────┐
// │  InputField Base Component  │
// ╘═════════════════════════════╛
export class InputField extends React.Component {
  // DefaultProps
  static defaultProps = {};
  // State
  state = {};
  // Inputs - Map
  inputMap = {
       "text": <TextInput />,
         "id": <IdInput />,
     "number": <NumberInput />,
        "int": <NumberInput int={true} />,
    "boolean": <BooleanInput />,
      "range": <NumberInput range={true} />,
       "list": <ListInput />,
      "color": <ColorInput />,
     "matrix": <MatrixInput />,
  };
  // Handler - Change
  handleChange = (value) => {
    // Get the value from event, assign to field, and pass up to parent
    const changedField = this.props.field;
    changedField.value = value;
    this.props.onChange(changedField);
  };
  // Render
  render() {
    // Create label element to pass to children
    const label = (
        <React.Fragment>
          { this.props.label && 
            <InputLabel name={this.props.name}
                        label={this.props.label} />
          }
        </React.Fragment>
    );
    // Return
    return(
      <React.Fragment>
        {React.cloneElement(this.inputMap[this.props.field.type], {
            ...this.props.field,
            "label": label,
            "autoId": this.props.autoId,
            "onChange": this.handleChange,
          }
        )}
      </React.Fragment>
    );
  }
}
// ┌─────────────────┐
// │  Input - Label  │
// ╘═════════════════╛
class InputLabel extends React.Component {
  // Render
  render() {
    // Return
    return(
      <label htmlFor={this.props.name} className="field--label">
        {typeof(this.props.label) === "string" ? 
         this.props.label : this.props.name}
      </label>
    );
  }
}
// ┌────────────────┐
// │  Input - Text  │
// ╘════════════════╛
export class TextInput extends React.Component {
  // DefaultProps
  static defaultProps = {
    "value": "",
    "label": true,
  };
  // Handler - Change
  handleChange = (event) => {
    // Pass change up to parent
    this.props.onChange(event.target.value, this.props.name);
  }
  // Render
  render() {
    return(
      <div className="field--container">
        { this.props.label && 
          <InputLabel name={this.props.name}
                      label={this.props.label} />
        }
        <div className="field--main">
          <input type="text" name={this.props.name}
                 className="field--input" size=""
                 value={this.props.value ?? ""} onChange={this.handleChange} />
        </div>
      </div>
    )
  }
}
// ┌──────────────┐
// │  Input - Id  │
// ╘══════════════╛
export class IdInput extends React.Component {
  // DefaultProps
  static defaultProps = {
    "value": "",
    "label": true,
    "options": [],
    "elementIds": [],
  };
  // Properties
  pickwhipButtonRef = React.createRef();
  // Handlers - Change
  handleChange = (event) => {
    // console.log(`IdInput | handleChange:`, event.target.value);
    this.props.onChange(event.target.value, this.props.name);
  }
  // Handlers - Autofill ID
  handleNewId = (event) => {
    this.props.onChange(this.props.autoId);
  }
  // Handlers - Pick-Whip ID Start
  handlePickWhipStart = (event) => {
    // Add events: MouseUp, MouseMove
    document.addEventListener("mouseup", this.handlePickWhipEnd);
    document.addEventListener("mousemove", this.handlePickWhipMove);
  }
  // Handlers - Pick-Whip ID End
  handlePickWhipEnd = (event) => {
    // Cleanup event-listeners, and pick-whip line
    document.removeEventListener("mouseup", this.handlePickWhipEnd);
    document.removeEventListener("mousemove", this.handlePickWhipMove);
    if (this.pickWhipLine) {
      this.pickWhipLine.release(); this.pickWhipLine = null;
    }
    // Find which filter--element is under mouse
    const hoverElement = document.querySelector(".element--form:hover")
                         ?? document.querySelector(".filter--element:hover");
    // Clear highlights after recording which was picked
    document.querySelectorAll(".pickwhip--hover").forEach(element => {
      element.classList.remove("pickwhip--hover");
    });
    // If no filter--element was found; do nothing
    if (!hoverElement) { return; }
    // Get value of the filter--element, and update value
    const resultValue = hoverElement.querySelector("input[name='result']").value;
    this.props.onChange(resultValue, this.props.name);
  }  
  // Handlers - Pick-Whip ID Move
  handlePickWhipMove = (event) => {
    // Find which valid element is under mouse
    const hoverElement = document.querySelector(".element--form:hover")
                         ?? document.querySelector(".filter--element:hover");
    // If no valid hover-element found, do nothing
    if (!hoverElement) { return; }
    // Find the field we're grabbing data from
    const hoverField = hoverElement.querySelector("input[name='result']");
    // If valid hover-target hasn't changed, do nothing
    if (hoverField === this?.pickWhipLine?.options?.end?.element) { return; }
    // Clear old highlight, and highlight new hover-element
    document.querySelector(".pickwhip--hover")?.classList?.remove("pickwhip--hover");
    hoverElement.classList.add("pickwhip--hover");
    // Update pick-whip line options, and refresh it
    if (this.pickWhipLine) { this.pickWhipLine.release(); }
    const startElement = this.pickwhipButtonRef.current;
    const lineOptions = {
      start: {
        element: startElement,
        position: { top: 0.5, left: 0.5 }
      },
      end : {
        element: hoverField,
        position: { top: 0.5, left: 0.5 }
      },
      style: "stroke:hsla(0,0%,0%,0.8); stroke-width:2; fill:transparent;",
      appendTo: document.body,
    };
    this.pickWhipLine = new LinePath(lineOptions);
    this.pickWhipLine.containerDiv.style["pointer-events"] = "none";
    // console.log(`pickWhipLine | Update:`, this.pickWhipLine);
  }
  // Render
  render() {
    // Initialise
    const resultFieldButtons = (
      <button className="field--button" title="Autofill ID" onClick={this.handleNewId}>
        {/* <i className="fas fa-file-signature fa-fw"></i> */}
        <i className="fas fa-sync fa-fw"></i>
      </button>
    );
    const blankTest = new RegExp(/^\W+$/); //Blank divider check
    const inFieldButtons = (
      <React.Fragment>
        <select className="field--button--dropdown" 
                value={this.props.value ?? ""} onChange={this.handleChange}>
          <option value=""></option> {/* Blank entry at start of list */}
          {this.props.options.map((value, index) =>
              <option key={value} value={value ?? ""} 
                      className={blankTest.test(value) ? "divider" : null}
                      disabled={blankTest.test(value)}>
                {value}
              </option>
          )}
          {this.props.elementIds.map((value, index) =>
            <option key={value} value={value ?? ""} 
                    className={blankTest.test(value) ? "divider" : null}
                    disabled={blankTest.test(value)}>
              {value}
            </option>
          )}
        </select>
        <button className="field--button" title="Pick-Whip ID"
                ref={this.pickwhipButtonRef} 
                onMouseDown={this.handlePickWhipStart}>
          <i className="fas fa-crosshairs fa-fw"></i>
        </button>
      </React.Fragment>
    );
    // Return
    return(
      <div className="field--container">
        { this.props.label && 
          <InputLabel name={this.props.name}
                      label={this.props.label} />
        }
        <div className="field--main">
          <input type="text" name={this.props.name} 
                 className="field--input" size=""
                 value={this.props.value ?? ""} onChange={this.handleChange} />
          <div className="field--buttons">
            { (this.props.name === "result") &&
              resultFieldButtons
            }
            { (this.props.name === "in" || this.props.name === "in2") &&
              inFieldButtons
            }
          </div>
        </div>
      </div>
    )
  }
}
// ┌──────────────────┐
// │  Input - Number  │
// ╘══════════════════╛
export class NumberInput extends React.Component {
  // DefaultProps
  static defaultProps = {
    "value": "",
    "label": true,
    "step": 1, 
    "int": false,
    "range": false,
    "min": 1, "max": 10,
    "keyMultipliers": {
      "shiftKey": 10,
      "ctrlKey": 2.5,
      "altKey": 0.1,
    },
  };
  // State
  state = {
    "step": this.props.step,
  };
  // Component - Mount
  componentDidMount() {
    // Add event-listener that prevents default wheel events
    document.body.addEventListener("wheel", this.handleWheelBlock, { passive: false });
  }
  // Component - UnMount
  componentWillUnmount() {
    // Clear event-listener that prevents default wheel events
    document.body.removeEventListener("wheel", this.handleWheelBlock);
  }
  // Handler - Change
  handleChange = (event, adjustValue) => {
    // Initialise
    const eventValue = event.target.value ?? this.props.value;
    // If eventValue doesn't pass validation; don't change anything
    let regExp = new RegExp("^[-]?[0-9]*[.]?[0-9]*[%]?$");
    if (!regExp.test(eventValue)) { return; }
    // If returning to blank value; pass blank to parent component and return
    if (eventValue === "" && !adjustValue) { 
      this.props.onChange("", this.props.name); 
      return;
    } 
    // Otherwise, prepare new value
    let newValue = parseFloat(eventValue);
    if (isNaN(newValue)) { newValue = ""; }
    // Flag certain conditions
    let isPercentage = typeof(eventValue) === "string"
                       && eventValue.includes("%") ? true : false;
    let isNegative = typeof(eventValue) === "string"
                     && eventValue.includes("-") ? true : false;
    let isDecimal = typeof(eventValue) === "string"
                    && eventValue.includes(".") ? true : false;
    let isTrailing = (isDecimal === true
                      && eventValue.match(/[.][1-9]*([0]+)[^\d]*$/)?.[1]?.length) ?? false;
    // If adjusting value; modify current value, and re-check
    if (adjustValue) {
      if (newValue === "") { newValue = 0; }
      newValue = parseFloat((newValue + adjustValue).toFixed(5));
      if (newValue >= 0) { isNegative = false; }
      if (!newValue.toString().includes(".")) { isDecimal = false; }
    }
    // If int mode is enabled; convert to int
    if (this.props.int === true) {
      // If adjusting value, round it up/down
      if (adjustValue > 0) { newValue = Math.ceil(newValue); }
      else if (adjustValue < 0) { newValue = Math.floor(newValue); }
      // Otherwise if typing number, just parse int
      else { newValue = parseInt(newValue); }
      // Fix NaN result, and set decimal flag
      if (isNaN(newValue)) { newValue = ""; }
      isDecimal = false;
    }   
    // If newValue was negative, and missing negative sign; re-add it
    if (isNegative && !newValue.toString().includes("-")) { 
      newValue = "-" + newValue; 
    }
    // If newValue was decimal, and missing decimal; re-add it
    if (isDecimal && !newValue.toString().includes(".")) {
      newValue = newValue + ".";
    }
    // If there were trailing zeroes; re-add them
    if (isTrailing > 0) { 
      newValue = newValue + "0".repeat(isTrailing);
    }
    // If newValue was percentage; re-add percentage
    if (isPercentage) { newValue = newValue + "%"; }
    // Pass event to parent component
    this.props.onChange(newValue, this.props.name);
  }
  // Handler - Randomise
  handleRandomise = (event) => {
    // Initialise
    let min = 1; let max = 999999999;
    // Generate new value (integer, inclusive)
    min = Math.ceil(min); max = Math.floor(max);
    let randomValue = Math.floor(Math.random() * (max - min + 1) + min);
    // Pass event to parent component
    this.props.onChange(randomValue, this.props.name);
  }
  // Handler - handleStepUpDown
  handleStepUpDown = (event, direction, stepSize) => {
    // Initialise
    if (event.passive === true) { event.preventDefault(); }
    // Calculate adjustment-size
    stepSize = stepSize || this.state.step || 1;
    const adjustValue = stepSize * direction;
    // Pass event to change handler
    this.handleChange(event, adjustValue);
  }
  // Handler - handleKeyDown
  handleKeyDown = (event) => {
    // If there's a key-modifier being pressed; get the step-size multiplier
    const newStepSize = this.handleKeyModifier(event);
    // Handle arrow-keys; by doing a step up/down
    if (event.key === "ArrowUp") { this.handleStepUpDown(event, 1, newStepSize); }
    else if (event.key === "ArrowDown") { this.handleStepUpDown(event, -1, newStepSize); }
    // If it's a repeat press of another key; ignore it
    if (event.repeat === true) { return; }
  }
  // Handler - handleWheel
  handleWheel = (event) => {
    // If no inputs focused, do nothing
    if (event.target !== document.activeElement
        && !event.target.parentElement.contains(document.activeElement)) { return; }
    // If scroll wasn't up/down, do nothing
    if (!event.deltaY) { return; }
    // If scroll was up/down at max/min, do nothing
    if ((event.deltaY < 0 && event.target.value === this.props.max)
        || (event.deltaY > 0 && event.target.value === this.props.min)) { return; }
    // If there's a key-modifier being pressed; get the step-size multiplier
    const newStepSize = this.handleKeyModifier(event);
    // Start/reset timer that blocks default scroll events
    clearTimeout(this.wheelBlock); 
    this.wheelBlock = setTimeout(() => {
      this.wheelBlock = false;
    }, 250);
    // Trigger adjustment step event
    if (event.deltaY < 0) { this.handleStepUpDown(event, 1, newStepSize); }
    else if (event.deltaY > 0) { this.handleStepUpDown(event, -1, newStepSize); }
  }
  // Handler - handleKeyModifier
  handleKeyModifier = (event) => {
    // If there's a key-modifier being pressed; get the step-size multiplier
    let stepMultiplier = 1;
    if (event.shiftKey) { stepMultiplier = this.props.keyMultipliers.shiftKey; }
    else if (event.ctrlKey || event.metaKey) { stepMultiplier = this.props.keyMultipliers.ctrlKey; }
    else if (event.altKey) { stepMultiplier = this.props.keyMultipliers.altKey; }
    // Calculate new step-size
    let newStepSize = parseFloat((this.props.step * stepMultiplier).toFixed(5));
    this.setState({ "step": newStepSize });
    return newStepSize;
  }
  // Handler - handleWheelBlock
  handleWheelBlock = (event) => {
    // If timer is running, block event
    if (this.wheelBlock) { event.preventDefault(); }
  }
  // Render
  render() {
    // Initialise
    const randomiseButton = (
      <button className="field--button" title="Randomise" 
              onClick={this.handleRandomise}>
        <i className="fas fa-random fa-fw"></i>
      </button>
    );
    // Return
    return(
      <div className="field--container">
        { this.props.label && 
          <InputLabel name={this.props.name}
                      label={this.props.label} />
        }
        <div className="field--main"
             onWheel={this.handleWheel}>
          <input type="text" name={this.props.name}
                 inputMode="numeric" pattern="^[-]?[0-9]*[.]?[0-9]*[%]?$"
                 className="field--input" size=""
                 value={this.props.value ?? ""} 
                 onChange={this.handleChange}
                 onKeyDown={this.handleKeyDown} />
          { this.props.range &&
            <input type="range" name={`${this.props.name}_slider`}
                   className="input--stacked" size=""
                   value={this.props.value ?? ""}
                   step={this.state.step}
                   min={this.props.min} max={this.props.max}
                   onChange={this.handleChange}
                   onKeyDown={this.handleKeyDown} /> }
          { this.props.name === "seed" &&
            <div className="field--buttons">
              { randomiseButton }
            </div>
          }
        </div>
      </div>
    )
  }
}
// ┌───────────────────┐
// │  Input - Boolean  │
// ╘═══════════════════╛
export class BooleanInput extends React.Component {
  // DefaultProps
  static defaultProps = {
    "value": null,
    "label": true,
    "tristate": false,
  }
  // Properties
  elementRef = React.createRef();
  // Component - Mount
  componentDidMount() {
    // Set indeterminate state, due to it only being mutable by javascript
    this.elementRef.current.indeterminate = (this.props.value == null) ? true : false;
  }
  // Component - Update
  componentDidUpdate() {
    // Set indeterminate state, due to it only being mutable by javascript
    this.elementRef.current.indeterminate = (this.props.value == null) ? true : false;
  }
  // Handler - Change
  handleChange = (event) => {
    // Calculate new value
    let newValue;
    if (this.props.value === false) { newValue = true; }
    else if (this.props.value === true) { newValue = (this.props.tristate) ? null : false; } 
    else if (this.props.value == null) { newValue = false; }
    // Pass new value up to parent
    this.props.onChange(newValue, this.props.name);
  }
  // Render
  render() {
    // Return
    return(
      <div className="field--container">
        { this.props.label && 
          <InputLabel name={this.props.name}
                      label={this.props.label} />
        }
        <div className="field--main">
          <input className="input--checkbox"
                 type="checkbox" name={this.props.name}
                 ref={this.elementRef}
                 checked={this.props.value === true}
                 onChange={this.handleChange} />
        </div>
      </div>
    )
  }
}
// ┌────────────────┐
// │  Input - List  │
// ╘════════════════╛
export class ListInput extends React.Component {
  // DefaultProps
  static defaultProps = {
    "value": "",
    "label": true,
    "options": [],
  }
  // Property - options
  get options() {
    // Process each option entry
    return this.props.options.map(option => {
      let newOption = {};
      // If option entry has label/value values, process it
      if (option.value || option.label) { 
         newOption.value = option.value ?? option.label ?? "";
         newOption.label = option.label ?? option.value ?? "";
      }
      // If option entry is an array, process it
      else if (Array.isArray(option)) { 
          newOption.value = option[0] ?? option[1] ?? "";
          newOption.label = option[1] ?? option[0] ?? "";
      }
      // Otherwise, it's just a single value, process it
      else {
          newOption.value = option ?? "";
          newOption.label = option ?? "";
      }
      // Check if option should be disabled
      let dividerCheck = new RegExp(/^[\W]+$/); //Blank divider check
      if (option?.disabled || dividerCheck.test(newOption.label)) {
        newOption.disabled = true;
      }
      // Return processed newOption
      return newOption;
    });
  }
  // Handler - handleChange
  handleChange = (event) => {
    this.props.onChange(event.target.value, this.props.name);
  }
  // Handler - handleWheel
  handleWheel = (event) => {
    // If this input isn't focused, do nothing
    if (event.target !== document.activeElement
        && !event.target.parentElement.contains(document.activeElement)) { return; }
    // If scroll wasn't up/down, do nothing
    if (!event.deltaY) { return; }
    // Otherwise, prevent default-scroll and process it
    if (event.passive === true) { event.preventDefault(); }
    // Find index of current selection
    const options = this.options;
    let currentIndex = options.findIndex(option => {
      return option?.value === this?.props?.value 
    });
    // Calculate new-index after scrolling
    let newIndex = currentIndex;
    do { 
      // Increment index
      newIndex = event.deltaY > 0 ? newIndex+1 : newIndex-1;
      // If new-index is out-of-range, do nothing
      if (newIndex > options.length-1 || newIndex < -1) { return; }
    } while (options?.[newIndex]?.disabled === true)
    // Trigger change with value of the new-index
    this.props.onChange(options?.[newIndex]?.value, this.props.name);
  }
  // Render
  render() {
    // Initialise
    let dividerTest = new RegExp(/^[\W]+$/); //Blank divider check
    // Return
    return(
      <div className="field--container">
        { this.props.label && 
          <InputLabel name={this.props.name}
                      label={this.props.label} />
        }
        <div className="field--main">
          <select className="field--input" name={this.props.name}
                  value={this.props.value ?? ""} 
                  onChange={this.handleChange}
                  onWheel={this.handleWheel}>
            <option key="-1" value=""></option> {/* Blank entry at start of list */}
            {this.options.map((option, index) =>
                <option key={index} value={option.value ?? ""} 
                        className={dividerTest.test(option.value) ? "divider" : null}
                        disabled={dividerTest.test(option.value)}>
                  {option.label ?? ""}
                </option>
            )}
          </select>
        </div>
      </div>
    )
  }
}
// ┌─────────────────┐
// │  Input - Color  │
// ╘═════════════════╛
export class ColorInput extends React.Component {
  // DefaultProps
  static defaultProps = {
    "value": "#808080",
    "label": true,
  };
  // Handler - Change
  handleChange = (event) => {
    // Store event trigger value
    let value = event.target.value;
    // Start/reset timer to buffer color-picker spam
    clearTimeout(this.handleChange.timer); 
    this.handleChange.timer = setTimeout(() => {
      this.props.onChange(value, this.props.name);
    }, 125);
  }
  // Render
  render() {
    return(
      <div className="field--container">
        { this.props.label && 
          <InputLabel name={this.props.name}
                      label={this.props.label} />
        }
        <div className="field--main">
            <input type="color" name={this.props.name}
                   value={this.props.value ?? ""} onChange={this.handleChange} />
        </div>
      </div>
    )
  }
}
// ┌──────────────────┐
// │  Input - Matrix  │
// ╘══════════════════╛
export class MatrixInput extends React.Component {
  // DefaultProps
  static defaultProps = {
    "value": "",
    "label": true,
    "step": 0.1,
    "grid": "3x3",
    "rowLabels": false,
    "colLabels": false,
  }
  // Handler - Change
  handleChange = (value, name) => {
    // Initialise
    let newMatrix = this.stringToMatrix(this.props.value);
    // Merge with an emptyMatrix to fill in missing values
    newMatrix = this.mergeMatrix(this.emptyMatrix, newMatrix);
    // If a value has been changed, update it
    if (!(value == null) && !(name == null)) {
      // Find which value changed
      const rowCol = name.split("_");
      const iRow = parseInt(rowCol[0]); const iCol = parseInt(rowCol[1]);
      // Update value that has changed
      newMatrix[iRow][iCol] = value.toString();
    }
    // Convert back to string of numbers
    newMatrix = this.matrixToString(newMatrix);
    // Pass value back to container
    this.props.onChange(newMatrix, this.props.name);
  }
  // Matrix properties
  get rowCol() { return this.props.grid.match(/(\d+)x(\d+)/i); }
  get rowCount() { return parseInt(this.rowCol?.[1] ?? 1); }
  get colCount() { return parseInt(this.rowCol?.[2] ?? 1); }
  // Matrix functions
  get emptyMatrix() {
    // Return emptyMatrix based on defined grid-size
    return new Array(this.rowCount).fill("0").map(() => new Array(this.colCount).fill("0"));
  }
  mergeMatrix(baseMatrix, override) {
    // Iterate every row, col to get values in baseMatrix
    for (const [iRow, row] of baseMatrix.entries()) {
      for (const [iCol] of row.entries()) {
        // Use override value if it exists, otherwise use base value
        baseMatrix[iRow][iCol] = override?.[iRow]?.[iCol] ?? baseMatrix?.[iRow]?.[iCol];
      }
    }
    // Return
    return baseMatrix;
  }
  matrixToString(matrix, delim) {
    // Initialise
    delim = delim ?? " ";
    // Convert to string
    let matrixString = matrix.map(function join(a) { 
      return Array.isArray(a) ? a.map(join).join(delim) : a;
    }).join(delim);
    // Return
    return matrixString;
  }
  stringToMatrix(matrixString) {
    // If matrixString is empty; return empty array
    if (matrixString === "") { return []; }
    // Split string of values into an array
    matrixString = matrixString ?? "";
    let matrixArray = matrixString.toString().split(/\s/);
    // Calculate grid-size, default to specified row number
    let numOfValues = matrixArray.length;
    let rowCount = this.rowCount;
    // If numOfValues is a square number, split into square
    for (let divisor = 9; divisor > 0; divisor--) {
      if (numOfValues === divisor * divisor
          || numOfValues === divisor * (divisor+1)) {
        rowCount = divisor;
        break;
      }
    }
    // Split matrix into rows
    matrixArray = splitToRows(matrixArray, rowCount);
    // Return
    return matrixArray;
    // Helper function (for splitting into nested-arrays)
    function splitToRows(array, rowCount) {
      let output = [];
      for (let iRow = rowCount; iRow > 0; iRow--) {
          output.push(array.splice(0, Math.ceil(array.length / iRow)));
      }
      return output;
    }
  }
  // Render
  render() {
    // Convert prop value string to the base matrix
    const propMatrix = this.stringToMatrix(this.props.value);
    // Merge an empty matrix and propMatrix, to make sure it's correct size
    const matrixValues = this.mergeMatrix(this.emptyMatrix, propMatrix);
    // Process row/col labels
    const rowLabels = this.props.rowLabels 
                      && this.props.rowLabels.map((label) => {
      return <label className="matrix--label">{label}</label>
    })
    const colLabels = this.props.colLabels 
                      && this.props.colLabels.map((label) => {
      return <label className="matrix--label">{label}</label>
    })
    // If labels on both axis, add blank spacer to start of colLabels
    if (colLabels && rowLabels) {
      colLabels.splice(0, 0, <label className="matrix--label" />);
    }
    // Return
    return(
      <div className="field--container">
        { (this.props.label) && 
          <InputLabel name={this.props.name}
                      label={this.props.label} />
        }
        <div className="field--main">
          <table className={"field--matrix"}>
            <tbody>
              { // Create matrix/grid of inputs
                // Col labels
                <React.Fragment>
                  { (colLabels) && 
                    <tr key="label"> 
                      { colLabels.map((colLabel, iCol) =>
                          <td className="matrix--label"
                              key={`label_${iCol}`}>
                            {colLabel}
                          </td>
                        )
                      } 
                    </tr>
                  }
                  { // For each row in matrix
                    matrixValues.map((row, iRow) => 
                      // Row labels
                      <tr key={`${iRow}`}>
                        { (rowLabels) && 
                          <td className="matrix--label"
                              key={`${iRow}_label`}>
                            <label className="matrix--label">{this.props.rowLabels[iRow]}</label>
                          </td>
                        }
                        { // For each col in that row
                          row.map((value, iCol) => 
                            <td key={`${iRow}_${iCol}`}>
                              <NumberInput name={`${iRow}_${iCol}`}
                                           label={false}
                                           value={value ?? ""} 
                                           step={this.props.step}
                                           onChange={this.handleChange} />
                            </td>
                          )
                        }
                      </tr>
                    )
                  }
                </React.Fragment> 
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
// ┌──────────┐
// │  Export  │
// ╘══════════╛
// export default InputField;
