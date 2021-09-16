import { FlowObjectData } from "flow-component-model";
import React from "react";
import PageSectionRepeater from "./PageSectionRepeater";
import RepeaterObject from "./RepeaterObject";
import RibbonBar from "./RibbonBar";
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
        let root: PageSectionRepeater = this.props.parent;
        let objectData: FlowObjectData = root.repeaterItems.get(this.props.internalId).objectData;
        let value: any = e.currentTarget.value;
        objectData.properties[valueName].value = value;
        
        console.log("Value changed " + valueName + " -> " + value);
        this.buildElement();
    }

    buildElement() {
        let root: PageSectionRepeater = this.props.parent;
        let item: RepeaterObject = root.repeaterItems.get(this.props.internalId);
            
        //reset elements
        let elements: any[] = [];
        //loop over the child elements
        root.childElements.forEach((childElement: any) => {
            if(childElement.componentType!=="outcomes") {
                elements.push(this.cloneContainer(childElement, item.objectData,item.order));
            }
        });
        this.setState({elements: elements})

    }

    inflateValue(value: string, repeatCount: number) : any {
        // value might contain {{name}} in multiple places.
        // each one needs replacing with the model's attribute value of that name
        let root: PageSectionRepeater = this.props.parent;
        let item: RepeaterObject = root.repeaterItems.get(this.props.internalId);
        
        if(value) {
            value = "" + value;
            let regEx = /{{(.*?)}}/g;
            let matches = Array.from(value.matchAll(regEx));

            for(const match of matches){
                console.log(match);
                let tValue: any;
                switch(match[1]){
                    case "#":
                        tValue = "" + repeatCount;
                        break;
                    
                    default:
                        if(match[1].indexOf("->")>=0){
                            // it's a sub value
                            let bits = match[1].split("->");
                            for(let pos = 0 ; pos < bits.length ; pos++) {
                                if(pos < (bits.length - 1)) {
                                    tValue = manywho.utils.getObjectDataProperty(item.objectData.properties,bits[pos]).objectData;
                                }
                                else {
                                    let objData: any = manywho.utils.getObjectDataProperty(item.objectData.properties,bits[pos]);
                                    tValue = this.convertToString(objData);
                                }
                            }
                            
                        }
                        else {
                            let objData: any = manywho.utils.getObjectDataProperty(item.objectData.properties,match[1]);
                            tValue = this.convertToString(objData);
                        }
                        break;
                }
                value = value.replace(match[0], tValue);
            }
        }
        return value;
    }

    convertToString(objData: any) : string{
        let val: string = "";
        switch (objData.contentType) {
            case "ContentDateTime":
                if(objData.contentValue) {
                    let dt: Date = new Date(objData.contentValue);
                    if(isNaN(dt.getTime())) {
                        val = "";
                    }
                    else {
                        val = dt.toLocaleString();
                    }
                }
                else {
                    val = ""; 
                }
                break;
            
            case "ContentNumber":
                val = "" + objData.contentValue;
                break;

            default:
                val = "" + objData.contentValue;
                break;
        }
        return val;
    }

    cloneComponent(component: any, objData: FlowObjectData, sequence: number) : any {
        let result: any;
        let value: string = "";
        let content: string = "";
        let label: string = "";
        let hint: string = "";
        let help: string = "";

        if(component.attributes?.fieldName) {
            value = this.inflateValue("{{" + component.attributes?.fieldName + "}}", sequence);
        }
        else {
            console.log("No fieldName attribute specified on component " + component.developerName + " - not a problem just notifying")
        }
        if(component.content) {
            content = this.inflateValue(component.content, sequence);
        }
        
        label = this.inflateValue(component.label, sequence);
        hint = this.inflateValue(component.hintValue, sequence);
        help = this.inflateValue(component.helpInfo, sequence);
        //props.id = undefined;
        switch(component.componentType) {
            case "input" :
                result = (
                    <div className={"mw-input has-outcomes form-group " + component.attributes?.classes}>
                        <div>
                            <label>
                                {label}
                            </label>
                            <input 
                                className="form-control" 
                                maxLength={component.maxSize} 
                                size={component.size} 
                                type="text" 
                                value={value} 
                                onChange={(e: any) => {this.valueChanged(e,component.attributes.FieldName)}}
                                readOnly={!component.isEditable}/>
                            <span className="help-block">{hint}</span>
                            <span className="help-block">{help}</span>
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
                                {label}
                            </label>
                            
                            <textarea 
                                className="form-control" 
                                maxLength={component.maxSize} 
                                cols={component.width} 
                                rows={component.height} 
                                value={value} 
                                readOnly={!component.isEditable}
                            />
                            <span className="help-block">{hint}</span>
                            <span className="help-block">{help}</span>
                        </div>
                    </div>
                );
                break;
            case "presentation" :
                result = (
                    <div className={"mw-presentation " + component.attributes?.classes}>
                        <div>
                            <label>
                                {label}
                            </label>
                            <div dangerouslySetInnerHTML={{__html: content}}/>
                            <span className="help-block">{hint}</span>
                            <span className="help-block">{help}</span>
                        </div>
                    </div>
                );
                break;
            case "checkbox" :
                let glyph: string = "glyphicon glyphicon-";
                let checked: boolean = false;
                if(value.toLowerCase() === "true") {
                    glyph += "check"
                    checked=true;
                }
                else {
                    glyph += "unchecked"
                }
                result = (
                    <div className={"mw-input has-outcomes form-group " + component.attributes?.classes}>
                        <div>
                            <div className="checkbox">
                                <label>
                                    <input type="checkbox" disabled={!component.isEditable} checked={checked}/>
                                    {label}
                                </label>
                                <span className="help-block">{hint}</span>
                                <span className="help-block">{help}</span>
                            </div>
                        </div>
                    </div>
                );
                break;

            case "image":
                result = (
                    <img 
                        className={component.attributes?.classes}
                        src={value}
                        width={(component.width || 250) + "px" }
                    />
                );
                break;

            default:
                result=(<div/>);
        }

        return result;
    }

    cloneContainer(container: any, objData: FlowObjectData, repeatCount: number) : any {
        let root: PageSectionRepeater = this.props.parent;
        let cloneClass: string = "clearfix mw-container " + container.attributes?.classes;
        switch(container.containerType) {
            case "HORIZONTAL_FLOW":
                cloneClass = "mw-inline_flow " + cloneClass;
            break;

            default:
                cloneClass = "mw-vertical_flow " + cloneClass;
            break;
        }

        let label : string = this.inflateValue(container.label, repeatCount);
        
        // should replicate flows ability to replace variables here

        let childComponents: any[] = manywho.model.getChildren(container.pageContainerId, root.props.flowKey);

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
        let parent: PageSectionRepeater = this.props.parent;
        let ribbon: any;
        if(parent.outcomes.length > 0){
            ribbon = (
                <RibbonBar 
                    parent={parent}
                    isTopLevel={false}
                    internalId={this.props.internalId}
                />
            );
        }
        return (
            <div
                className={parent.repeater.attributes?.repeaterClasses}
            >
                {ribbon}
                { this.state.elements }
            </div>
        )
    }
}