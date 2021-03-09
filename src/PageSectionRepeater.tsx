import { eLoadingState, FlowComponent, FlowField, FlowObjectData, FlowObjectDataArray } from "flow-component-model";
import React from "react";
import G13PageSectionRepeat from "./PageSectionRepeat";
import FlowSectionRepeat from "./PageSectionRepeat";
import G13RepeaterObject from "./RepeaterObject";

declare const manywho: any;

export default class PageSectionRepeater extends FlowComponent {
    
    repeater: any;

    repeaterItems: Map<string,G13RepeaterObject>;
    repeaterObjects: Map<string, G13PageSectionRepeat> = new Map();
    repeaterElements: Array<any>;

    constructor(props: any) {
        super(props);
    }

    setRepeatObject(key: string, element: any) {
        if(element) {
            this.repeaterObjects.set(key, element)
        }
        else {
            if(this.repeaterObjects.has(key)) {
                this.repeaterObjects.delete(key);
            }
        }
    }

    async componentDidMount() {
        await super.componentDidMount();

        //get and save top level repeating container
        this.repeater = manywho.model.getContainer(this.componentId, this.flowKey);
    

        //get model, it should be defined in an attribute called ListField
        if(!this.repeater.attributes?.ListField) {
            console.log("No ListField attribute specified on repeater")
        }
        else {
            let list: FlowObjectDataArray = (await this.loadValue(this.repeater.attributes?.ListField)).value as FlowObjectDataArray;
            this.buildFromModel(list);
        }
        
        this.forceUpdate();
    }

    buildFromModel(items: FlowObjectDataArray) {
        this.repeaterItems = new Map();
        let order: number=1;
        items.items.forEach((item: FlowObjectData) => {
            this.repeaterItems.set(item.internalId, new G13RepeaterObject(item.internalId,order, item));
            order++;
        });
        this.buildClones();
    }

    buildClones() {
        this.repeaterElements = [];
        this.repeaterItems.forEach((element: G13RepeaterObject, key: string) => {
            this.repeaterElements.push(
                <FlowSectionRepeat
                    key= {key}
                    internalId={key}
                    parent={this}
                    ref={(element: FlowSectionRepeat) => {this.setRepeatObject(key,element)}}
                />
            );
        });
    }

    
    render() {

        if(!this.repeater || !this.repeaterItems) {
            return (
                <div/>
            );
        }

        //this is the class for the parent repeater container which will hold one clone per object data
        let parentClass: string = "mw-vertical_flow clearfix mw-container " + this.repeater.attributes?.classes;

        return(
            <div
                className={parentClass}
            >
                <div
                    className="clearfix"
                >
                    {this.repeaterElements}
                </div>
            </div>
        );
    }
}

export const getChartContainer = () => PageSectionRepeater;
//: typeof G13PageSectionRepeater =>
//manywho.component.getByName("charts") || ChartContainer
manywho.component.registerContainer('charts', PageSectionRepeater);