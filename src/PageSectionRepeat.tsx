import { FlowObjectData } from "flow-component-model";
import React from "react";
import G13PageSectionRepeater from "./PageSectionRepeater";
import G13RepeaterObject from "./RepeaterObject";
declare const manywho: any;

export default class PageSectionRepeat extends React.Component<any,any> {
    
    
    constructor(props: any) {
        super(props);
        this.state = {elements: []};
    }

    componentDidMount() {
        this.buildElement();

    }

    valueChanged(e: any, valueName: string) {
        let root: G13PageSectionRepeater = this.props.parent;
        let objectData: FlowObjectData = root.repeaterItems.get(this.props.internalId).objectData;
        let value: any = e.currentTarget.value;
        objectData.properties[valueName].value = value;
        
        console.log("Value changed " + valueName + " -> " + value);
        this.buildElement();
    }

    buildElement() {
        let root: G13PageSectionRepeater = this.props.parent;
        let item: G13RepeaterObject = root.repeaterItems.get(this.props.internalId);
        //get the child components of the repeater
        let childElements: any[] = manywho.model.getChildren(root.repeater.pageContainerId, root.flowKey)
        
        //reset elements
        let elements: any[] = [];
        //loop over the child elements
        childElements.forEach((childElement: any) => {
            elements.push(this.cloneContainer(childElement, item.objectData,item.order));
        });
        this.setState({elements: elements})

    }

    cloneComponent(component: any, objData: FlowObjectData, sequence: number) : any {
        let result: any;
        let value: any = "";
        if(component.attributes.FieldName) {
            if(component.attributes.FieldName.indexOf("->") < 0 ) {
                try {
                    value = objData.properties[component.attributes.FieldName].value;
                }
                catch(e) {
                    console.log("Error geting value of [" + component.attributes.FieldName + "] on component " + component.developerName);
                }
                
            }
            else {
                let subs : string[] = component.attributes.FieldName.split("->");
                value = objData;
                subs.forEach((ele: string) => {
                    try {
                        value = value.properties[ele].value;
                    }
                    catch(e) {
                        console.log("Error geting value of [" + ele + "] on component " + component.developerName);
                    }
                });
            }
        }
        else {
            console.log("No FieldName attribute specified on component " + component.developerName + " - not a problem just notifying")
        }
        //props.id = undefined;
        switch(component.componentType) {
            case "input" :
                result = (
                    <div className={"mw-input has-outcomes form-group " + component.attributes?.classes}>
                        <div>
                            <label>
                                {component.label}
                            </label>
                            <input 
                                className="form-control" 
                                maxLength={component.maxSize} 
                                size={component.size} 
                                type="text" 
                                value={value} 
                                onChange={(e: any) => {this.valueChanged(e,component.attributes.FieldName)}}
                                readOnly={!component.isEditable}/>
                            <span className="help-block">{component.hintValue}</span>
                            <span className="help-block">{component.helpInfo}</span>
                        </div>
                    </div>
                );
                break;
            case "textarea" :
                //let width: string = (component.width * 0.8) + "rem";
                //<div  className="sum-text-area" style={{width: width}} dangerouslySetInnerHTML={{__html: value}}/>
                result = (
                    <div className={"mw-input has-outcomes form-group " + component.attributes?.classes}>
                        <div>
                            <label>
                                {component.label}
                            </label>
                            
                            <textarea className="form-control" maxLength={component.maxSize} cols={component.width} rows={component.height} value={value} readOnly={!component.isEditable}/>
                            <span className="help-block">{component.hintValue}</span>
                            <span className="help-block">{component.helpInfo}</span>
                        </div>
                    </div>
                );
                break;
            case "presentation" :
                result = (
                    <div className={"mw-presentation " + component.attributes?.classes}>
                        <div>
                            <label>
                                {component.label}
                            </label>
                            <div dangerouslySetInnerHTML={{__html: component.content}}/>
                            <span className="help-block">{component.hintValue}</span>
                            <span className="help-block">{component.helpInfo}</span>
                        </div>
                    </div>
                );
                break;
            case "checkbox" :
                let glyph: string = "glyphicon glyphicon-";
                if(value === true) {
                    glyph += "check"
                }
                else {
                    glyph += "unchecked"
                }
                result = (
                    <div className={"mw-input has-outcomes form-group " + component.attributes?.classes}>
                        <div>
                            <div className="checkbox">
                                <label>
                                    <input type="checkbox" disabled={!component.isEditable} checked={value}/>
                                    {component.label}
                                </label>
                                <span className="help-block">{component.hintValue}</span>
                                <span className="help-block">{component.helpInfo}</span>
                            </div>
                        </div>
                    </div>
                );
                break;

            default:
                result=(<div/>);
        }

        return result;
    }

    cloneContainer(container: any, objData: FlowObjectData, repeatCount: number) : any {
        let root: G13PageSectionRepeater = this.props.parent;
        let cloneClass: string = "clearfix mw-container " + container.attributes?.classes;
        switch(container.containerType) {
            case "HORIZONTAL_FLOW":
                cloneClass = "mw-inline_flow " + cloneClass;
            break;

            default:
                cloneClass = "mw-vertical_flow " + cloneClass;
            break;
        }

        let label : string = container.label || "";
        label = label.replace("{{#}}",repeatCount.toString());
        // should replicate flows ability to replace variables here

        let childComponents: any[] = manywho.model.getChildren(container.pageContainerId, root.flowKey);
        //let children: any[] = manywho.component.getChildComponents(childComponents,this.repeater.pageContainerId, this.flowKey);

        let components: any[] = []
        
        childComponents.forEach((child: any) => {
            if(child.componentType) {
                components.push(this.cloneComponent(child,objData,repeatCount));
            }
            if(child.containerType) {
                components.push(this.cloneContainer(child,objData,repeatCount));
            }
        });
        
        return(
            <div
                className={cloneClass}
            >
                <h3>{label}</h3>
                <div
                    className="clearfix"
                >
                    {components}
                </div>
            </div>
        );
    }



    render() {


        return (
            <div>
                {
                    this.state.elements
                }
            </div>
        )
    }
}