// ┌───────────┐
// │  Imports  │
// ╘═══════════╛
import React from "react";
import ReactDOMServer from "react-dom/server";
import * as InputFields from "components/InputFields";
import * as ElementForms from "components/ElementForms";
import svgElements from "data/svg-elements";
import XMLViewer from "react-xml-viewer";
// ┌────────────────┐
// │  FilterEditor  │
// ╘════════════════╛
class FilterEditor extends React.Component {
  // DefaultProps
  static defaultProps = {};
  // State
  state = {
    "elements": [],
    "selectedId": null,
  };
  // Handler - Select Element
  handleSelectElement = (autoId) => {
    // Update State
    this.setState({ "selectedId": autoId });
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
  // Handler - Change Element
  handleChangeElement = (newElement) => {
    // Update State
    this.setState(prevState => {
      // Find element to update
      let targetIndex = prevState.elements
                                 .findIndex(element => element.autoId === newElement.autoId);
      // Replace element
      if (targetIndex !== -1) { prevState[targetIndex] = newElement; }
      // Return modified element-list
      return ({ "elements": [...prevState.elements] });
    });
  }
  // Handler - Move Element
  handleMoveElement = (moveDirection, targetAutoId) => {
    // Update State
    this.setState(prevState => {
      // Find moving element's index
      const findIndex = prevState.elements
                                 .findIndex(element => element.autoId === targetAutoId);
      // Calculate newIndex
      let newIndex = findIndex + moveDirection;
      // If newIndex is out-of-bounds, do nothing
      if (newIndex < 0 || newIndex > prevState.elements.length - 1) { return; }
      // Move element to newIndex
      prevState.elements.splice(newIndex, 0, prevState.elements.splice(findIndex, 1)[0]);
      // Return modified element-list
      return ({ "elements": [...prevState.elements] });
    });
  }
  // Handler - Delete Element
  handleDeleteElement = (targetAutoId) => {
    // Update State
    this.setState(prevState => {
      // Remove element from element-list
      prevState.elements = prevState.elements.filter(el => el.autoId !== targetAutoId);
      // If element was selected, clear it
      if (prevState.selectedId === targetAutoId) { prevState.selectedId = null; }
      // Return modified element-list
      return ({ 
        "elements": [...prevState.elements],
        "selectedId": prevState.selectedId,
      });
    });
  }
  // Render
  render() {
    // Calculate autoIds
    const elementsAdded = [];
    const elementIds = [];
    this.state.elements.forEach(element => {
      // Add entry to elementsAdded
      elementsAdded.push(element.shorthand);
      // Generate autoId
      const elementCount = elementsAdded.filter(el => el === element.shorthand).length;
      element.autoId = `${element.shorthand}-${elementCount}`;
      // If the element hasn't had a result-id assigned yet, assign autoId
      const resultAttribute = element.attributes["result"];
      if (resultAttribute && !resultAttribute.value) {
        resultAttribute.value = element.autoId;
      }
      // Add element result id into list of ids, for in/in2 fields
      elementIds.push(resultAttribute.value);
    });
    // Find selected element
    const selectedElement = this.state.elements.find(el => el.autoId === this.state.selectedId);
    // Return
    return(
      <main className="app--main">
        <FilterPreview elements={this.state.elements} />
        <div className="main--filter">
          <h2 className="filter--header">&lt;filter&gt;</h2>
          <ElementList elements={this.state.elements}
                       elementIds={elementIds}
                       selectedId={this.state.selectedId}
                       onSelectElement={this.handleSelectElement} 
                       onAddNewElement={this.handleAddNewElement}
                       onChangeElement={this.handleChangeElement}
                       onMoveElement={this.handleMoveElement} />
        </div>
        <div className="main--details">
          { selectedElement &&
            <ElementForms.EditElementForm element={selectedElement}
                                          elementIds={elementIds}
                                          onChangeElement={this.handleChangeElement}
                                          onDeleteElement={this.handleDeleteElement} />
          }
        </div>
      </main>
    );
  };
}
// ┌───────────────┐
// │  ElementList  │
// ╘═══════════════╛
class ElementList extends React.Component {
  // State
  state = {
    newElementType: "",
  };
  // Handlers - New Element Type Change
  handleNewElementTypeChange = (value, fieldName) => {
    this.setState({ newElementType: value });
  }
  // Handlers - Add New Element
  handleAddNewElement = (event) => {
    // If there's no element selected, do nothing
    if(!this.state.newElementType) { return }
    // Pass event to parent
    this.props.onAddNewElement(this.state.newElementType);
  }
  // Render
  render() {
    // Return
    return(
      <React.Fragment>
        <div className="filter--elements">
          { (this.props.elements) &&
            this.props.elements.map((element, index) => (
              <ElementForms.EditElementIdsForm 
                            key={element.autoId}
                            element={element}
                            elementIds={this.props.elementIds}
                            selected={element.autoId === this.props.selectedId ? "selected" : ""}
                            onSelectElement={this.props.onSelectElement} 
                            onChangeElement={this.props.onChangeElement}
                            onMoveElement={this.props.onMoveElement} />
          ))}
        </div>
        <div className="filter--footer">
          <InputFields.ListInput name="type"
                                 label={false}
                                 value={this.state.newElementType}
                                 options={["feFlood", "feImage", "feTurbulence",
                                           "————", "feColorMatrix", "feComponentTransfer",
                                           "feConvolveMatrix", "feDisplacementMap", 
                                           "feDropShadow", "feGaussianBlur",
                                           "feMorphology", "feOffset", "feTile",
                                           "————", "feDiffuseLighting", "feSpecularLighting",
                                           "————", "feBlend", "feComposite", "feMerge"]}
                                 onChange={this.handleNewElementTypeChange} />
          <button className="" title="Add Filter Element" onClick={this.handleAddNewElement}>
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </React.Fragment>
    );
  };
}
// ┌─────────────────┐
// │  FilterPreview  │
// ╘═════════════════╛
class FilterPreview extends React.Component {
  // DefaultProps
  static defaultProps = {};
  // State
  state = {};
  // Render
  render() {
    // Generate preview SVG
    const previewSVG = <SVGPreview elements={this.props.elements}
                                   previewPreset={this.state.previewPreset} />;
    // Return
    return(
      <div className="main--preview">
        <h2 className="preview--title">Filter Preview</h2>
        <div className="preview--svg">
          {previewSVG}
        </div>
        <div className="preview--code">
          <SVGPreviewCode svg={previewSVG} />
        </div>
      </div>
    );
  };
}
// ┌──────────────┐
// │  SVGPreview  │
// ╘══════════════╛
class SVGPreview extends React.Component {
  // DefaultProps
  static defaultProps = {
    "previewPreset": "Solid Background",
  };
  // Components - FilterElements
  get FilterElements() {
    // For each element in filter, generate it
    const FilterElements = this.props.elements.map((element, index) => {
      // Return filter element
      return generateElement(element, index);
    });
    // Return FilterElements
    return FilterElements;
    // Function - generateElement()
    function generateElement(element, index) {
      // Define element attributes
      const elementProps = { "key": index };
      for (const attribute of Object.values(element.attributes)) {
        // If attribute doesn't have a value, skip it
        if (attribute.value == null
            || attribute.value === "") { continue; }
        // Convert attribute-names to React syntax 
        // (e.g. "flood-color" → "floodColor")
        let attributeName = attribute.name;
        const regExp = /-(\w)/;
        while (attributeName.match(regExp)) {
          attributeName = attributeName.replace(regExp, (m, p1) => {
            return p1.toUpperCase();
          });
        }
        // Otherwise, assign it
        elementProps[attributeName] = attribute.value;
      };
      // If there's any child elements, recursively call
      const childElements = element.childElements?.map((element, index) => {
        // Return childElement
        return generateElement(element, index);
      });
      // Return filter element
      return (React.createElement(element.type, elementProps, childElements));
    }
  }
  // Components - filteredElement
  get FilteredElement() {
    // Map of elements by previewPreset names
    const elementMap = {
      "Solid Background": <rect x="0%" y="0%" width="100%" height="100%" fill="#808080" />,
      "Centered Circle": <circle cx="50%" cy="50%" r="33%" fill="#404040" />,
      "Lorem Ipsum": <text x="50%" y="50%"
                           textAnchor="middle" textLength="90%"
                           fontFamily="serif" fill="#202020"
                           fontSize="72" fontWeight="900">Lorem Ipsum</text>,
    }
    // Match element to previewPreset
    const FilteredElement = elementMap?.[this.props.previewPreset];
    // Return
    return FilteredElement;
  }
  // Render
  render() {
    // Return
    return(
      <React.Fragment>
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" 
             xmlnsXlink="http://www.w3.org/1999/xlink">
          <defs>
            {/* Filter */}
            <filter id="new-filter" x="-10%" y="-10%" width="120%" height="120%">
              { this.FilterElements }
            </filter>
          </defs>
          {/* Object to Filter */}
          <g filter={this.FilterElements.length > 0 ? "url(#new-filter)" : ""}>
            { this.FilteredElement }
          </g>
        </svg>
      </React.Fragment>
    );
  };
}
// ┌──────────────────┐
// │  SVGPreviewCode  │
// ╘══════════════════╛
class SVGPreviewCode extends React.Component {
  // DefaultProps
  static defaultProps = {
    "indentSize": 2,
    "collapsible": false,
    "theme": {
                "textColor": "#212121",
             "commentColor": "#616161",
           "separatorColor": "#616161",
                 "tagColor": "#D32F2F",
        "attributeKeyColor": "#F9A825",
      "attributeValueColor": "#4CAF50",
               "cdataColor": "#673AB7",
            "overflowBreak": true,
    },
  };
  // Render
  render() {
    const svgCode = ReactDOMServer.renderToStaticMarkup(this.props.svg);
    // Return
    return(
      <React.Fragment>
        <XMLViewer className="code--viewer"
                   xml={svgCode}
                   indentSize={this.props.indentSize}
                   collapsible={this.props.collapsible}
                   theme={this.props.theme} />
      </React.Fragment>
    );
  };
}
// ┌──────────┐
// │  Export  │
// ╘══════════╛
export default FilterEditor;
